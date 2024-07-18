import path from "path";

import { ChallengeRegistry } from "../lib/challenges/challenge/registry";
import { Rctf } from "../packages/plugins/rctf";
import { createLoader } from "./factory";

const registry = new ChallengeRegistry(
  createLoader({
    loaderType: "resource",
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  }),
  [new Rctf(null)]
);

await registry.loadChallenges();
