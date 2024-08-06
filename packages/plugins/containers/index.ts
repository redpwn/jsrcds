import * as docker from "@pulumi/docker";

export class Containers {
  constructor() {}

  buildImage(challengeName: string, dockerfile: string) {
    const container = new docker.Image(challengeName, {
      imageName: `${challengeName}`,
      build: {
        dockerfile: dockerfile,
      },
    });
  }
}
