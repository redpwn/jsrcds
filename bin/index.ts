import "reflect-metadata";

import path from "path";

import { Deployment } from "rcds/deployment";
import config from "rcds/config";
import { TSFileLoader } from "@rcds/loader-tscfg";

const loader = new TSFileLoader({
  repoRoot: path.join(process.cwd(), "tests/examples/"),
  model: {},
});

const prog = await loader.getChallenges();
if (!prog) {
  throw new Error("No challenges found");
}
const deployment = new Deployment(config.deploymentConfig);
const stack = await deployment.createStack(prog);
await stack.up({ onOutput: console.info });
