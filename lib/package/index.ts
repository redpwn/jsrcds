import { Loader, type LoaderConfig } from "@rcds/loader";
import { Plugin } from "@rcds/plugin";
import config from "@rcds/config";

import path from "path";
import fs from "fs/promises";

import { tsImport } from "tsx/esm/api";

export class PackageManager {
  private static packageManager: PackageManager = new PackageManager(
    path.join(process.cwd(), config.packagePath)
  );

  constructor(public packagesPath: string) {}

  async getLoaders(): Promise<Loader<LoaderConfig>[]> {
    const loaderPath = path.join(this.packagesPath, "loaders");
    const loaders = await fs.readdir(loaderPath);

    return Promise.all(
      loaders.map(async (dir) => {
        const loader = await tsImport(
          path.join(loaderPath, dir),
          import.meta.url
        );
        return loader;
      })
    );
  }

  async getPlugins() {
    const pluginsPath = path.join(this.packagesPath, "plugins");
    const plugins = await fs.readdir(pluginsPath);

    // return Promise.all(
    //   plugins.map(async (dir) => {
    //     const plugin = await tsImport(
    //       path.join(pluginsPath, dir),
    //       import.meta.url
    //     );
    //     return plugin;
    //   })
    // );
    return Promise.all(
      [
        "/Users/pepsipu/Programming/jsrcds/packages/plugins/adminbot",
        "/Users/pepsipu/Programming/jsrcds/packages/plugins/containers",
      ].map(async (dir) => {
        const plugin = await tsImport(dir, import.meta.url);
        return plugin;
      })
    );
  }

  public static getPackageManager() {
    return PackageManager.packageManager;
  }
}
