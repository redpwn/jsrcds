import "reflect-metadata";

import path from "path";

import { createLoader } from "@rcds/loader";
import { Deployment } from "@rcds/deployment";
import { registerPackages } from "@rcds/registry";

await registerPackages();

const loader = createLoader("TSRawFileLoader", {
  repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
});

const prog = await loader.getChallenges();
const stack = await Deployment.createStack(prog);
await stack.up({ onOutput: console.info });
