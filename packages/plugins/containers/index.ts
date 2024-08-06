import * as build from "@pulumi/docker-build";

export class Containers {
  constructor() {}

  buildImage(challengeName: string, dockerfile: string) {
    const container = new build.Image(challengeName, {
      push: false,
      dockerfile: {
        inline: dockerfile,
      },
    });
  }
}
