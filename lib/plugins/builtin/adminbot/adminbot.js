// TEMPLATING

// if (challenge.adminbot) {
//   model.adminbot = `https://adminbot.${rootConfig.challengeHost}/${challenge.id}`;
// }

// SCHEMA

// adminbot: z
// .string()
// .optional()
// .describe("Path to adminbot configuration file for this challenge."),

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import esbuild from "esbuild";
import fs from "fs";
import { auth as googleAuth } from "google-auth-library";
import path from "path";
import config from "../../config.js";
import { repoRoot } from "../../util.js";

const getConfigStub = (challenges) => {
  const imports = [];
  const entries = [];
  const botChallenges = challenges
    .filter((c) => c.deployed && c.adminbot)
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const [i, challenge] of botChallenges.entries()) {
    const name = `config${i}`;
    const importPath = path.posix.join(
      "../../..",
      challenge.segment,
      challenge.adminbot
    );
    imports.push(`import ${name} from ${JSON.stringify(importPath)}`);
    entries.push(`  [${JSON.stringify(challenge.id)}, ${name}],`);
  }
  return `${imports.join(
    "\n"
  )}\n\nexport const challenges = new Map([\n${entries.join("\n")}\n])\n`;
};

export const buildConfig = async (challenges) => {
  const dir = path.join(repoRoot, "deploy/adminbot/config");
  await fs.promises.mkdir(dir, { recursive: true });
  const stubPath = path.join(dir, "stub.js");
  await fs.promises.writeFile(stubPath, getConfigStub(challenges));
  const outfile = path.join(dir, "config.js");
  await esbuild.build({
    absWorkingDir: repoRoot,
    entryPoints: [stubPath],
    outfile,
    loader: {
      ".png": "binary",
    },
    platform: "node",
    bundle: true,
  });
  return await fs.promises.readFile(outfile);
};

const secretManager = new SecretManagerServiceClient({
  authClient: googleAuth,
});
const secretName = "adminbot-config";

export const createPlan = async (challenges) => {
  const [secret] = await secretManager.accessSecretVersion({
    name: secretManager.secretVersionPath(
      config.googleProject,
      secretName,
      "latest"
    ),
  });
  const newConfig = await buildConfig(challenges);
  if (Buffer.compare(secret.payload.data, newConfig) === 0) {
    return;
  }
  return newConfig;
};

const formatConfig = (config) => `
<details>
  <summary>config</summary>

\`\`\`javascript
${config}
\`\`\`

</details>
`;

export const formatPlan = (plan) => {
  if (!plan) {
    return "No changes";
  }
  return formatConfig(plan);
};

export const applyPlan = async (plan) => {
  if (!plan) {
    return;
  }
  await secretManager.addSecretVersion({
    parent: secretManager.secretPath(config.googleProject, secretName),
    payload: { data: plan },
  });
};
