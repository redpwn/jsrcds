import path from "path";

import { ChallengeRegistry } from "../lib/challenge/challenge/registry";
import { Rctf } from "../packages/plugins/rctf";
import { createLoader } from "./factory";

const registry = new ChallengeRegistry(
  createLoader({
    loaderType: "tscfg",
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  }),
  [new Rctf(null)]
);

await registry.loadChallenges();
