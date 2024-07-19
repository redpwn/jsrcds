// import path from "path";

// import { ChallengeRegistry } from "../lib/challenge/registry";
// import { Rctf } from "../packages/plugins/rctf";
// import { createLoader } from "./factory";

// const registry = new ChallengeRegistry(
//   createLoader({
//     loaderType: "tscfg",
//     repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
//   } as any),
//   [new Rctf(null)]
// );

// import { PackageManager } from "@rcds/package";
// console.log(await PackageManager.getPackageManager().getPlugins());

// await registry.loadChallenges();

import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

// Find the latest Ubuntu precise image.
const ubuntuRemoteImage = new docker.RemoteImage("ubuntu", {
  name: "ubuntu:precise",
});
// Start a container
const ubuntu = new docker.Container("ubuntu", {
  name: "foo",
  image: ubuntuRemoteImage.imageId,
});

import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
