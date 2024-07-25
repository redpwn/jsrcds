import { Bundle } from "rcds/bundle";

import { Loader } from "rcds/loader";
import { Plugin } from "rcds/plugin";
import { Provider } from "rcds/provider";

interface Config {}

export class DefaultBundle extends Bundle<Config, any, any, any> {
  async getLoaders() {
    return [];
  }
  async getPlugins() {
    return [];
  }
  async getProviders() {
    return [];
  }
}
