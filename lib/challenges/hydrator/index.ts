import type { Plugin } from "../../plugins";

export class Hydrator {
  globalModel: Record<string, any> = {};

  registerDependency() {}

  publish;

  constructor(plugins: Plugin<any>[]) {
    // plugins.forEach((plugin) => {
    //   plugin.getResourceBlocks().forEach((resourceBlock) => {
    //     this.globalModel[resourceBlock.key] = {};
    //   });
    // });
  }
}
