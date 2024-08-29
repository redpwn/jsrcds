import * as pulumi from "@pulumi/pulumi";
import { Containers, type BuildImageArgs } from "@rcds/plugin-containers";
import type { Cluster } from "@rcds/resource-cluster";

interface ChallengeArgs {
  name: string;
  containers: BuildImageArgs[];
}

export class Challenge {
  constructor(private containers: Containers, private cluster: Cluster) {}

  createChallenge(args: ChallengeArgs) {
    const challenge = new ChallengeComponent(args.name, {});

    const containers = this.containers.buildImages(args.name, args.containers, {
      parent: challenge,
    });

    // containers.forEach((container) => {
    //   this.cluster.deployContainer(
    //     {},
    //     {
    //       parent: challenge,
    //     }
    //   );
    // });

    // const hash = this.containers.buildImages(challengeDirectory);
    // this.runtime.deployChallenge({
    //   name: config.id,
    // });
    // const urls = this.bucket.uploadFiles({
    //   // ...
    // });
    // this.scoreboard.pushChallenge({
    //   // ...
    // });

    // create container resources: build container
    // create cluster resources: Namespaces, Deployments, Services, NetworkPolicies, and TraefikRoutes
    // -- potentially klodd resources!
    // create bucket resources: upload files
    // create scoreboard resources: push challenge, file urls
    // monitoring, adminbot?
  }
}

class ChallengeComponent extends pulumi.ComponentResource {
  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super("rcds:challenge:Challenge", name, {}, opts);
  }
}
