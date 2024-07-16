import path from "path";
import core from "@actions/core";
import github from "@actions/github";
import { auth as googleAuth } from "google-auth-library";
import { Storage } from "@google-cloud/storage";
import childProcess from "child_process";
import got, { HTTPError } from "got";
import config from "./config.js";
import { getChallenges } from "./challenges.js";
import { isSpeculative, baseRef, deployTag } from "./util.js";

const registry = config.images.registry;
const getDockerTag = (sha) => `sha-${sha}`;

const getBuildConfig = ({ tag, context, repo, dockerfile, buildArgs }) => {
  const challengesRef = `${registry}/${config.images.challengesBase}/${repo}`;
  const cacheRef = `${registry}/${config.images.cacheBase}/${repo}`;
  return {
    repo,
    config: {
      context,
      file: path.posix.join(context, dockerfile),
      "build-args": Object.entries(buildArgs ?? {})
        .map(([k, v]) => `${k}=${v}`)
        .join("\n"),
      tags: `${challengesRef},${challengesRef}:${tag}`,
      push: true,
      provenance: false,
      "cache-from": `type=registry,ref=${cacheRef}`,
      "cache-to": `type=registry,mode=max,ref=${cacheRef}`,
    },
  };
};

const getDiff = (...paths) =>
  new Promise((resolve) => {
    const proc = childProcess.spawn("git", [
      "diff",
      "--quiet",
      baseRef,
      "--",
      ...paths,
    ]);
    proc.on("exit", (code) => resolve(code !== 0));
  });

const getDockerManifest = async (req, repo, tag) => {
  try {
    return await req({
      url: `${repo}/manifests/${tag}`,
      headers: { accept: "*/*" },
    });
  } catch (e) {
    if (e instanceof HTTPError && e.response.statusCode === 404) {
      return;
    }
    throw e;
  }
};

const putDockerManifest = async (req, repo, tag, manifest) => {
  await req({
    url: `${repo}/manifests/${tag}`,
    method: "PUT",
    body: manifest.body,
    headers: { "content-type": manifest.headers["content-type"] },
  });
};

const storage = new Storage({ authClient: googleAuth });
const req = got.extend({
  prefixUrl: `https://${registry}/v2/${config.images.challengesBase}`,
  // https://cloud.google.com/artifact-registry/docs/docker/authentication#token
  username: "oauth2accesstoken",
  password: await googleAuth.getAccessToken(),
});
const bucket = storage.bucket(config.uploads.bucket);
const beforeTag = getDockerTag(baseRef);
const nowTag = getDockerTag(github.context.sha);
const { challenges, errors } = await getChallenges();
for (const error of errors) {
  core.error(error);
}
const buildJobs = [];

await core.group("builds", () =>
  Promise.all(
    challenges.flatMap((challenge) =>
      Object.entries(challenge.containers).map(async ([name, container]) => {
        if (!container.build) {
          return;
        }
        const context = path.posix.join(
          challenge.segment,
          container.build.context,
        );
        const repo = path.posix.join(challenge.segment, name);
        const buildConfig = getBuildConfig({
          tag: nowTag,
          context,
          repo,
          dockerfile: container.build.dockerfile,
          buildArgs: container.build.args,
        });
        if (await getDiff(challenge.configPath, context)) {
          core.info(`${repo}: diff`);
          buildJobs.push(buildConfig);
          return;
        }
        const manifest = await getDockerManifest(req, repo, beforeTag);
        if (!manifest) {
          core.info(`${repo}: no manifest for ${beforeTag}`);
          buildJobs.push(buildConfig);
          return;
        }
        if (!isSpeculative) {
          await putDockerManifest(req, repo, nowTag, manifest);
        }
        core.info(`${repo}: copied manifest ${beforeTag} to ${nowTag}`);
      }),
    ),
  ),
);

const uploads = challenges.flatMap((c) => c.provide);
await core.group("uploads", () =>
  Promise.all(
    uploads.map(async (upload) => {
      if (!upload.filePath) {
        return;
      }
      const file = bucket.file(upload.key);
      const [exists] = await file.exists();
      if (exists) {
        core.info(`${upload.key}: exists`);
        return;
      }
      if (!isSpeculative) {
        await bucket.upload(upload.filePath, {
          destination: file,
          metadata: { contentDisposition: "attachment" },
        });
      }
      core.info(`${upload.key}: uploaded`);
    }),
  ),
);

core.setOutput("builds", buildJobs);
core.setOutput("deploy", errors.length === 0);
core.setOutput("deployTag", deployTag);
