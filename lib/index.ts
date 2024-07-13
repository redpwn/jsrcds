import path from "path";

import { getChallenges } from "./challenges";
import { FileLoader } from "./challenges/loader/file";

import { PluginManager } from "./plugins/manager";

const { challenges, errors } = await getChallenges(
  new FileLoader({
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  })
);

const pluginManager = PluginManager.createDefaultManager();

for (const error of errors) {
  console.error(error);
}
