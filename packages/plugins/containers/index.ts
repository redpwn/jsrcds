import { Plugin, Resource } from "@rcds/plugin";
import * as docker from "@pulumi/docker";

interface BuildImageConfig {
  isRemote?: boolean;
  image?: string;
  path?: string;
}

class Image extends Resource {
  constructor(config: BuildImageConfig, opts: any = {}) {
    super("containers:Image", opts);
    if (config.image) {
      new docker.RemoteImage(
        "ubuntu",
        {
          name: "ubuntu:precise",
        },
        { parent: this }
      );
    }
  }
}

class Container extends Resource {
  constructor(name: string, config: any, opts: any = {}) {
    super("containers:Container", opts);
    new docker.Container(name, config, { parent: this });
  }
}

export default class Containers extends Plugin {
  public name = "containers";

  public static buildImage(config: BuildImageConfig) {
    return new Image(config);
  }
}
