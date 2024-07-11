import { auth as googleAuth } from "google-auth-library";
import got from "got";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "../../config.js";
import { deepCompare, isSpeculative } from "../../util.js";

const getReq = async () => {
  const secretManager = new SecretManagerServiceClient({
    authClient: googleAuth,
  });
  const secretName = isSpeculative
    ? config.scoreboard.rctf.tokenNames.read
    : config.scoreboard.rctf.tokenNames.write;
  const [secret] = await secretManager.accessSecretVersion({
    name: secretManager.secretVersionPath(
      config.googleProject,
      secretName,
      "latest"
    ),
  });
  return got.extend({
    prefixUrl: `${config.scoreboard.rctf.url}/api/v1/admin`,
    headers: { authorization: `Bearer ${secret.payload.data.toString()}` },
    resolveBodyOnly: true,
    responseType: "json",
  });
};
let savedReq;
const req = async (...rest) => {
  if (!savedReq) {
    savedReq = getReq();
  }
  return (await savedReq)(...rest);
};

const getChallenges = async () => {
  const { kind, data } = await req("challs");
  if (kind !== "goodChallenges") {
    throw new Error(`rctf error: ${kind}`);
  }
  return data;
};

const deleteChallenge = async (id) => {
  const { kind } = await req({
    url: `challs/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
  if (kind !== "goodChallengeDelete") {
    throw new Error(`rctf error: ${kind}`);
  }
};

const applyChallenge = async (challenge) => {
  const { kind } = await req({
    url: `challs/${encodeURIComponent(challenge.id)}`,
    method: "PUT",
    json: { data: challenge },
  });
  if (kind !== "goodChallengeUpdate") {
    throw new Error(`rctf error: ${kind}`);
  }
};

const getRctfChallenge = (entry) => ({
  id: entry.id,
  author: entry.author,
  category: entry.category,
  description: entry.description,
  flag: entry.flag,
  name: entry.name,
  points: entry.value,
  tiebreakEligible: entry.tiebreakEligible,
  sortWeight: entry.sortWeight,
  files: entry.provide.map((p) => ({ name: p.name, url: p.url })),
});

export const createPlan = async (newEntries) => {
  const plan = [];
  const oldChallenges = await getChallenges();
  const oldById = new Map(oldChallenges.map((c) => [c.id, c]));
  const newById = new Map(
    newEntries.filter((e) => e.visible).map((e) => [e.id, getRctfChallenge(e)])
  );
  for (const [id, challenge] of oldById) {
    if (!newById.has(id)) {
      plan.push({ type: "delete", challenge });
    }
  }
  for (const [id, challenge] of newById) {
    if (!oldById.has(challenge.id)) {
      plan.push({ type: "create", challenge });
    } else if (!deepCompare(oldById.get(id), challenge)) {
      plan.push({ type: "update", challenge });
    }
  }
  return plan;
};

export const applyPlan = async (plan) => {
  for (const { type, challenge } of plan) {
    if (type === "delete") {
      await deleteChallenge(challenge.id);
    } else if (type === "create" || type === "update") {
      await applyChallenge(challenge);
    }
  }
};

const formatChallenge = (challenge) => `
<details>
  <summary>${challenge.category}/${challenge.name}</summary>
  <table>
    <tr>
      <td>Author</td>
      <td>${challenge.author}</td>
    </tr>
    <tr>
      <td>Points</td>
      <td>Min: ${challenge.points.min}, Max: ${challenge.points.max}</td>
    </tr>
    <tr>
      <td>Flag</td>
      <td><code>${challenge.flag}</code></td>
    </tr>
  </table>
  <blockquote>

${challenge.description}

  </blockquote>
</details>
`;

export const formatPlan = (plan) => {
  if (plan.length === 0) {
    return "No changes";
  }
  const deleted = [];
  const updated = [];
  const created = [];
  for (const { type, challenge } of plan) {
    if (type === "delete") {
      deleted.push(`- ${challenge.category}/${challenge.name}`);
    } else if (type === "update") {
      updated.push(formatChallenge(challenge));
    } else if (type === "create") {
      created.push(formatChallenge(challenge));
    }
  }
  return [
    deleted.length > 0 ? "### Delete" : "",
    ...deleted,
    updated.length > 0 ? "### Update" : "",
    ...updated,
    created.length > 0 ? "### Create" : "",
    ...created,
  ].join("\n");
};
