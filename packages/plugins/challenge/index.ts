import pulumi from "@pulumi/pulumi";
import { Containers } from "@rcds/plugin-containers";

interface ChallengeArgs {}

class Challenge {
  constructor(private containers: Containers) {}

  createChallenge(name: string, args: ChallengeArgs) {
    const challenge = new ChallengeComponent(name, {});

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
    this.containers.buildImages(
      "",
      {},
      {
        parent: challenge,
      }
    );
  }
}
