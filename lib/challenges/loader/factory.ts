import type { Loader, LoaderConfig } from ".";
import { ClassicFileLoader } from "./classic";
import { ResourceFileLoader } from "./resource";

// fixme: fix return type
export function createLoader(loaderConfig: LoaderConfig): Loader<LoaderConfig> {
  if (loaderConfig.loaderType === "classic")
    return new ClassicFileLoader(loaderConfig);
  else if (loaderConfig.loaderType === "resource")
    return new ResourceFileLoader(loaderConfig);
  else {
    throw new Error("LoaderFactory called with unknown loaderType");
  }
}
