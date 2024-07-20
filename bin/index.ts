import path from "path";

import { ChallengeRegistry } from "../lib/challenge/registry";
import { Rctf } from "../packages/plugins/rctf";
import { createLoader } from "./factory";

const registry = new ChallengeRegistry(
  createLoader({
    loaderType: "tscfg",
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  }),
  [new Rctf(null)]
);

await registry.loadChallenges();

// import * as docker from "@pulumi/docker";
// import { Deployment } from "@rcds/deployment";

// const prog = async () => {
//   // Find the latest Ubuntu precise image.
//   const ubuntuRemoteImage = new docker.RemoteImage("ubuntu", {
//     name: "ubuntu:precise",
//   });
//   // Start a container
//   const ubuntu = new docker.Container("ubuntu", {
//     name: "foo",
//     image: ubuntuRemoteImage.imageId,
//   });

//   return {
//     containerId: ubuntu.id,
//   };
// };

// const stack = await Deployment.createStack(prog);
// await stack.up({ onOutput: console.info });
