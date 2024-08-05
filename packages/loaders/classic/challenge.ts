import type { ChallengeConfig } from "./schema";

export class Challenge {
  constructor(public config: ChallengeConfig) {}

  createResources() {
    // create container resources: build container
    // create cluster resources: Namespaces, Deployments, Services, NetworkPolicies, and TraefikRoutes
    // -- potentially klodd resources!
    // create bucket resources: upload files
    // create scoreboard resources: push challenge, file urls
    // monitoring, adminbot?
  }
}
