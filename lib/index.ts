import path from "path";

import { ResourceFileLoader } from "./challenges/loader/resource";
import { ChallengeRegistry } from "./challenges/challenge";
import { LoaderFactory } from "./challenges/loader/factory";

const registry = new ChallengeRegistry(
  new ResourceFileLoader({
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  }),
  []
);

await registry.loadChallenges();
