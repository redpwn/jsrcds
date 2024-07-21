// import ContainerSchema from "./container";
// SCHEMA STUFF

// Object.fromEntries(
//     Object.entries(config.containers ?? {}).map(([name, entry]: any) => [
//       name,
//       {
//         image: entry.image,
//         build: {
//           context: entry.build?.context ?? entry.build,
//           dockerfile: entry.build?.dockerfile ?? "Dockerfile",
//           args: entry.build?.args,
//         },
//         ports: entry.ports ?? [],
//         replicas: entry.replicas ?? 1,
//         environment: entry.environment ?? {},
//         resources: entry.resources,
//         securityContext: {
//           privileged: entry.securityContext?.privileged ?? false,
//         },
//       },
//     ])
//   ),

// VALIDATION
// for (const [name, container] of Object.entries(challenge.containers)) {
//     if (!container.build) {
//       continue;
//     }
//     const dockerfile = path.join(
//       repoRoot,
//       challenge.segment,
//       container.build.context,
//       container.build.dockerfile
//     );
//     const stat = await fs.promises.stat(dockerfile);
//     if (stat.size === 0) {
//       throw new Error(
//         `empty dockerfile: ${challenge.segment}/${name}: ${dockerfile}`
//       );
//     }
//   }

import { Plugin } from "@rcds/plugin";
import * as docker from "@pulumi/docker";

interface BuildImageConfig {
  path: string;
}

export default class Containers extends Plugin<any> {
  public name = "containers";

  public static buildImage(config: BuildImageConfig) {
    const ubuntuRemoteImage = new docker.RemoteImage("ubuntu", {
      name: "ubuntu:precise",
    });

    const ubuntu = new docker.Container("ubuntu", {
      name: "foo",
      image: ubuntuRemoteImage.imageId,
    });

    return {
      containerId: ubuntu.id,
    };
  }
}

// export class ContainersBlockConfig extends ResourceBlockConfig<any> {
//   public key = "containers";
//   public schema = ContainerSchema;
// }
