import { type Cluster } from "@rcds/resource-cluster";

import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

class K8SCluster extends pulumi.ComponentResource implements Cluster {
  constructor(name: string, opts: pulumi.ComponentResourceOptions) {
    super("rcds:k8s:Cluster", name, {}, opts);
  }

  createRoute() {}
}
