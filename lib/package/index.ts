import { Loader } from "@rcds/loader";
import { Plugin } from "@rcds/plugin";
import config from "@rcds/config";

import path from "path";
import fs from "fs";

export class PackageManager {
  public loaders: Loader<any>[];
  public plugins: Plugin<any>[];

  private static packageManager: PackageManager = new PackageManager(
    config.packagePath
  );

  constructor(public packagesPath: string) {
    this.loaders = this.getLoaders();
    this.plugins = this.getPlugins();
  }

  private getLoaders(): Loader<any>[] {
    const loaderPath = path.join(this.packagesPath, "loaders");

    return fs.readdirSync(loaderPath).map((dir) => {
      const loader = require(path.join(loaderPath, dir));
      return loader.default;
    });
  }

  private getPlugins() {
    const pluginsPath = path.join(this.packagesPath, "plugins");

    return fs.readdirSync(pluginsPath).map((dir) => {
      const plugin = require(path.join(pluginsPath, dir));
      return plugin.default;
    });
  }

  public static getPackageManager() {
    return PackageManager.packageManager;
  }
}
