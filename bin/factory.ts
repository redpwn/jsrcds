import type { Loader, LoaderConfig } from "../lib/challenges/loader";

import {
  ClassicFileLoader,
  type ClassicFileLoaderConfig,
} from "../packages/loaders/classic";
import {
  ResourceFileLoader,
  type ResourceFileLoaderConfig,
} from "../packages/loaders/resource";

/**
 * Factory method for generating {@link Loader} based on loaderConfig type
 *
 * @param loaderConfig - Config of type {@link LoaderConfig} that specifies how Loader should be generated
 * @returns Loader built from loaderConfig
 */
export function createLoader(loaderConfig: LoaderConfig): Loader<LoaderConfig> {
  if (loaderConfig.loaderType === "classic")
    return new ClassicFileLoader(loaderConfig as ClassicFileLoaderConfig);
  else if (loaderConfig.loaderType === "resource")
    return new ResourceFileLoader(loaderConfig as ResourceFileLoaderConfig);
  else {
    throw new Error("LoaderFactory called with unknown loaderType");
  }
}
