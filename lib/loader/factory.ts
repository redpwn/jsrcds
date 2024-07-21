import { type LoaderConfig } from ".";
import { LOADERS } from "@rcds/packages";

export const createLoader = <R extends LoaderConfig>(config: R) => {
  const SelectedLoader = LOADERS.find((loader) => loader.name === config.type);
  if (!SelectedLoader) {
    throw new Error(`Loader of type "${config.type}" not found`);
  }
  return new SelectedLoader(config as any); // TODO: fix this any
};
