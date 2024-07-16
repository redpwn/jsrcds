import type { Loader, LoaderConfig } from ".";
import { ClassicFileLoader } from "./classic";
import { ResourceFileLoader } from "./resource";

/**
 * Factory method for generating {@link Loader} based on loaderConfig type
 *
 * @param loaderConfig - Config of type {@link LoaderConfig} that specifies how Loader should be generated
 * @returns Loader built from loaderConfig
 */
export function createLoader(loaderConfig: LoaderConfig): Loader<LoaderConfig> {
  if (loaderConfig.loaderType === "classic")
    return new ClassicFileLoader(loaderConfig);
  else if (loaderConfig.loaderType === "resource")
    return new ResourceFileLoader(loaderConfig);
  else {
    throw new Error("LoaderFactory called with unknown loaderType");
  }
}
