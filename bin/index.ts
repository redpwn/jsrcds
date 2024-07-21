import "reflect-metadata";

import path from "path";

import { createLoader } from "@rcds/loader";
import { Deployment } from "@rcds/deployment";
import { registerPackages } from "../lib/registrar";

await registerPackages();

const loader = createLoader("TSFileLoader", {
  repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
});

const prog = await loader.getChallenges();
const stack = await Deployment.createStack(prog);
await stack.up({ onOutput: console.info });
