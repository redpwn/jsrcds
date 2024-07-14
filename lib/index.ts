import path from "path";

import { getChallenges } from "./challenges";
import { ResourceFileLoader } from "./challenges/loader/resource";

// import { PluginManager } from "./plugins/manager";

const { challenges, errors } = await getChallenges(
  new ResourceFileLoader({
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  })
);

console.log(challenges[0]);

// const pluginManager = PluginManager.createDefaultManager();

for (const error of errors) {
  console.error(error);
}
