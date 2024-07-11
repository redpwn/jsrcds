import crypto from "crypto";
import fs from "fs";
import handlebars from "handlebars";

import rootConfig from "./config.js";
import { deployTag, isPrd, repoRoot, tlsPort } from "./util.js";

const templateChallenge = (challenge, description) => {
  const model = { challenge };
  const exposes = Object.values(challenge.expose).flat();
  if (challenge.adminbot) {
    model.adminbot = `https://adminbot.${rootConfig.challengeHost}/${challenge.id}`;
  }
  if (challenge.instancer) {
    // klodd challenges only have one expose
    const kloddId = (exposes[0].http ?? exposes[0].tls.hostname).slice(
      0,
      -rootConfig.challengeHost.length - 1
    );
    model.instancer = `https://instancer.${rootConfig.challengeHost}/challenge/${kloddId}`;
  }
  // only one expose; add unambiguous shortcuts to model
  if (exposes.length === 1) {
    model.host = exposes[0].http ?? exposes[0].host ?? exposes[0].tls.hostname;
  }
  const http = exposes.filter((ex) => ex.http);
  if (http.length === 1) {
    model.url = `https://${http[0].http}`;
    model.link = `[${http[0].http}](${model.url})`;
  }
  const tcp = exposes.filter((ex) => ex.tcp);
  if (tcp.length === 1) {
    model.port = tcp[0].tcp;
    model.nc = `nc ${tcp[0].host} ${model.port}`;
  }
  const tls = exposes.filter((ex) => ex.tls);
  if (tls.length === 1) {
    model.port = tlsPort;
    model.nc = `socat - openssl:${tls[0].tls.hostname}:${model.port}`;
    if (tls[0].tls.entrypoint === "https") {
      model.url = `https://${tls[0].tls.hostname}`;
      model.link = `[${tls[0].tls.hostname}](${model.url})`;
    }
  }
  return handlebars.compile(description)(model);
};

const hashFile = (name) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(name);
    stream.on("error", reject);
    stream.pipe(hash);
    stream.on("end", () => resolve(hash.digest("hex")));
  });

const getBucketHost = (name) => {
  if (name.includes(".")) {
    return name;
  }
  return `${name}.storage.googleapis.com`;
};
