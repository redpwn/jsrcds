import {
  ComponentResource,
  type ComponentResourceOptions,
} from "@pulumi/pulumi";

export abstract class Plugin {}

export abstract class Resource extends ComponentResource {
  constructor(
    name: string,
    challengeName: string,
    opts: ComponentResourceOptions
  ) {
    super(`rcds:plugin:${name}`, `${name}:${challengeName}`, {}, opts);
  }
}
