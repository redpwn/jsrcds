import { readdir } from "fs/promises";
import { tsImport } from "tsx/esm/api";
import path from "path";

export const registerPackages = async () => {
  // iterate over the folders in packages/{loaders, plugins} and import

  const loadersPath = path.join(process.cwd(), "packages/loaders");
  const pluginsPath = path.join(process.cwd(), "packages/plugins");

  const loaders = await readdir(loadersPath);
  const plugins = await readdir(pluginsPath);

  // create packages array, then iterate over it and import
  const packages = [
    ...loaders.map((p) => `packages/loaders/${p}`),
    ...plugins.map((p) => `packages/plugins/${p}`),
  ];

  for (const packageName of packages) {
    await tsImport(path.join(process.cwd(), packageName), import.meta.url);
  }
};
