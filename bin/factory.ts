import type { Loader } from "../lib/challenges/loader";
import {
  ClassicFileLoader,
  type ClassicFileLoaderConfig,
} from "../packages/loaders/classic";
import { ResourceFileLoader } from "../packages/loaders/resource";

type PossibleLoaderConfig = ClassicFileLoaderConfig | ResourceFileLoader;

/**
 * Factory method for generating {@link Loader} based on loaderConfig type
 *
 * @param loaderConfig - Config of type {@link LoaderConfig} that specifies how Loader should be generated
 * @returns Loader built from loaderConfig
 */
export function createLoader(
  loaderConfig: PossibleLoaderConfig
): Loader<PossibleLoaderConfig> {
  if (loaderConfig.loaderType === "classic")
    return new ClassicFileLoader(loaderConfig);
  else if (loaderConfig.loaderType === "resource")
    return new ResourceFileLoader(loaderConfig);
  else {
    throw new Error("LoaderFactory called with unknown loaderType");
  }
}
