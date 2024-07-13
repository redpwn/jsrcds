import type { Plugin } from ".";
import Adminbot from "./adminbot";
import Containers from "./containers";

export class PluginManager<PluginMap> {
  static defaultPlugins = {
    adminbot: new Adminbot(),
    containers: new Containers(),
  };

  plugins: PluginMap;

  constructor(plugins: PluginMap) {
    this.plugins = plugins;
  }

  getPlugin<K extends keyof PluginMap>(key: K): PluginMap[K] {
    return this.plugins[key];
  }

  static createDefaultManager() {
    return new PluginManager(this.defaultPlugins);
  }
}
