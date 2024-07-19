import { Loader } from "@rcds/loader";
import { Plugin } from "@rcds/plugin";
import config from "@rcds/config";

import path from "path";
import fs from "fs/promises";
export class PackageManager {
  private static packageManager: PackageManager = new PackageManager(
    path.join(process.cwd(), config.packagePath)
  );

  constructor(public packagesPath: string) {}

  async getLoaders(): Promise<Loader<any>[]> {
    const loaderPath = path.join(this.packagesPath, "loaders");

    return Promise.all(
      (await fs.readdir(loaderPath)).map(async (dir) => {
        const loader = await import(path.join(loaderPath, dir));
        return loader;
      })
    );
  }

  async getPlugins() {
    const pluginsPath = path.join(this.packagesPath, "plugins");

    // return Promise.all(
    //   (await fs.readdir(pluginsPath)).map(async (dir) => {
    //     const plugin = await import(path.join(pluginsPath, dir));
    //     return plugin;
    //   })
    // );
    return Promise.all(
      [
        "/Users/pepsipu/Programming/jsrcds/packages/plugins/adminbot",
        "/Users/pepsipu/Programming/jsrcds/packages/plugins/containers",
      ].map(async (dir) => {
        const plugin = await import(dir);
        return plugin;
      })
    );
  }

  public static getPackageManager() {
    return PackageManager.packageManager;
  }
}
