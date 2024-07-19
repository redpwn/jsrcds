import { PackageManager } from "@rcds/package";

export { ChallengeRegistry } from "./registry";

console.log(await PackageManager.getPackageManager().getPlugins());

export default {};
