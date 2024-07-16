import path from "path";

import { ChallengeRegistry } from "./challenges/challenge";
import { Rctf } from "./plugins/builtin/rctf";

const registry = new ChallengeRegistry(
  {
    loaderType: "resource",
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  },
  [new Rctf(null)]
);

await registry.loadChallenges();
