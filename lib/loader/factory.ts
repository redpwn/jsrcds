import { Loader } from "@rcds/loader";
import { container } from "@rcds/registry";

export const createLoader = <C>(name: string, config: C): Loader<C> => {
  const SelectedLoader = container.resolve<new (config: C) => Loader<C>>(name);
  if (!SelectedLoader) {
    throw new Error(`Loader of name "${name}" not found`);
  }
  return new SelectedLoader(config);
};
