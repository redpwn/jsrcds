import { PackageManager } from "@rcds/package";

export { ChallengeRegistry } from "./registry";

const plugins = await PackageManager.getPackageManager().getPlugins();
console.log(plugins);

export default {
  r: "meopw",
};
