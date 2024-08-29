import * as dockerBuild from "@pulumi/docker-build";
import pulumi from "@pulumi/pulumi";

import assert from "assert";

import { FileStorage } from "@rcds/resource-fs";
import { LocalStorage } from "@rcds/provider-local/fs";

import path from "path";

export interface BuildImageArgs {
  name: string;
  build: {
    dockerfile: string;
    context: string;
  };
}

// TODO: make containers fs agnostic
export class Containers {
  constructor(private fs: LocalStorage) {
    assert(fs instanceof FileStorage);
  }

  buildImages(
    dir: string,
    options: BuildImageArgs[],
    opts?: pulumi.CustomResourceOptions
  ): dockerBuild.Image[] {
    const absDir = path.join(this.fs.root, dir);
    return options.map(({ name, build }) => {
      const container = new dockerBuild.Image(
        name,
        {
          push: false,
          dockerfile: {
            location: path.join(absDir, build.dockerfile),
          },
          context: {
            location: path.join(absDir, build.context),
          },
        },
        opts
      );
      return container;
    });
  }
}
