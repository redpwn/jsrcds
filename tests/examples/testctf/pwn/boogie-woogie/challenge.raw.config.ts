import { Image } from "@pulumi/docker";
import * as kx from "@pulumi/kubernetesx";

const build = new Image("build", {
  imageName: "pepsipu/boogie-woogie-build",
  build: {
    platform: "linux/amd64",
    context: `${import.meta.dirname}/src/build`,
  },
  skipPush: true,
});

const deploy = new Image("deploy", {
  imageName: "pepsipu/boogie-woogie-deploy",
  build: {
    platform: "linux/amd64",
    context: `${import.meta.dirname}/src`,
  },
  skipPush: true,
});

const pb = new kx.PodBuilder({
  containers: [
    {
      image: deploy.imageName,
      ports: { http: 80 },
    },
  ],
});

const deployment = new kx.Deployment("boogie-woogie-deployment", {
  spec: pb.asDeploymentSpec({ replicas: 1 }),
});

const service = deployment.createService({
  type: "NodePort",
});

// const network = r.network({
//   target: 5000,
//   tcp: 31040,
//   healthContent: "proof of work",
//   container: deploy,
// });

// const fileUrls = r.media({
//   files: [
//     "src/boogie-woogie.c",
//     {
//       name: "boogie-woogie",
//       content: build.get_file("/app/boogie-woogie"),
//     },
//   ],
// });

// r.challenge({
//   name: "boogie-woogie",
//   author: "pepsipu",
//   description: `i've been watching too much jjk\n ${network.nc}`,
//   provides: fileUrls,
// });
