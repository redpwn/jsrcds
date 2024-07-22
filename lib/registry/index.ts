export * from "tsyringe";
import { tsImport } from "tsx/esm/api";
import { glob } from "glob";

export const registerPackages = async () => {
  const packagePaths = await glob("packages/{plugins,loaders,resources/*}/*", {
    absolute: true,
  });

  await Promise.all(
    packagePaths.map((path) => tsImport(path, import.meta.url))
  );
};
