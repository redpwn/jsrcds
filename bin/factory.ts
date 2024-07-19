import type { Loader, LoaderConfig } from "../lib/loader";

import ClassicFileLoader, {
  type ClassicFileLoaderConfig,
} from "../packages/loaders/classic";
import ResourceFileLoader, {
  type ResourceFileLoaderConfig,
} from "../packages/loaders/resource";
import TSFileLoader, {
  type TSFileLoaderConfig,
} from "../packages/loaders/tscfg";

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
  else if (loaderConfig.loaderType === "tscfg")
    return new TSFileLoader(loaderConfig as TSFileLoaderConfig);
  else {
    throw new Error("LoaderFactory called with unknown loaderType");
  }
}
