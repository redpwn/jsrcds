import {
  ComponentResource,
  type ComponentResourceOptions,
} from "@pulumi/pulumi";

export abstract class Resource extends ComponentResource {
  constructor(
    pluginName: string,
    name: string,
    challengeName: string,
    opts: ComponentResourceOptions
  ) {
    super(
      `rcds:${pluginName}:${name}`,
      `${challengeName}-${name.toLowerCase()}`,
      {},
      opts
    );
  }
}
