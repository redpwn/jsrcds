import "reflect-metadata";

import path from "path";

import { DefaultBundle } from "@rcds/bundle-default";

const bundle = new DefaultBundle({
  repoRoot: path.join(process.cwd(), "tests/examples/"),
});

await bundle.deployChallenges();
