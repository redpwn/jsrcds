import { container } from "tsyringe";
import { Loader } from "@rcds/loader";

export const createLoader = <C>(name: string, config: C) => {
  const SelectedLoader = container.resolve<new (config: C) => Loader<C>>(name);
  console.log(SelectedLoader);
  if (!SelectedLoader) {
    throw new Error(`Loader of name "${name}" not found`);
  }
  return new SelectedLoader(config);
};
