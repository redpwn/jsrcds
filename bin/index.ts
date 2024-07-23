import "reflect-metadata";

import path from "path";

import { Deployment } from "rcds/src/deployment";
import config from "rcds/src/config";
import { TSFileLoader } from "@rcds/loader-tscfg";

const loader = new TSFileLoader({
  repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
});

const prog = await loader.getChallenges();
const deployment = new Deployment(config.deploymentConfig);
const stack = await deployment.createStack(prog);
await stack.up({ onOutput: console.info });
