import path from "path";

import { getChallenges } from "./challenges";
import { ClassicFileLoader } from "./challenges/loader/classic";

// import { PluginManager } from "./plugins/manager";

const { challenges, errors } = await getChallenges(
  new ClassicFileLoader({
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  })
);

// const pluginManager = PluginManager.createDefaultManager();

for (const error of errors) {
  console.error(error);
}
