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

export default class ContainersPlugin extends Plugin<any> {
  public name = "containers";
}

// export class ContainersBlockConfig extends ResourceBlockConfig<any> {
//   public key = "containers";
//   public schema = ContainerSchema;
// }
