import type { Cluster, ContainerDeployment } from "@rcds/resource-cluster";

import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export class K8SDeployment extends pulumi.ComponentResource {
  constructor(name: string, opts: pulumi.ComponentResourceOptions) {
    super("rcds:k8s:Deployment", name, {}, opts);
  }
}

export class K8SCluster implements Cluster {
  deployContainer() {}

  getNamespaceName(challenge) {
    return `jsrcds-${challenge.id}`;
  }

  createNamespace(challenge) {
    new k8s.core.v1.Namespace({});
  }

  createDeployments() {}

  createServices() {}

  createTraefikResources() {}
}
