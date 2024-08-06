interface BuildImageConfig {
  isRemote?: boolean;
  image?: string;
  path?: string;
}

// class Image extends Resource {
//   constructor(config: BuildImageConfig, opts: any = {}) {
//     super("containers:Image", opts);
//     if (config.image) {
//       new docker.RemoteImage(
//         "ubuntu",
//         {
//           name: "ubuntu:precise",
//         },
//         { parent: this }
//       );
//     }
//   }
// }

// class Container extends Resource {
//   constructor(name: string, config: any, opts: any = {}) {
//     super("containers:Container", opts);
//     new docker.Container(name, config, { parent: this });
//   }
// }

class ContainerRegistry {}

type ContainerOptions = any;

import { inject, registry } from "@rcds/registry";

@registry([{ token: "Containers", useValue: Containers }])
export default class Containers extends Plugin {
  public name = "containers";

  constructor(
    @inject(ContainerRegistry) public registry: ContainerRegistry,
    options: ContainerOptions
  ) {
    super();
    // use container options to create a new image
  }
}
