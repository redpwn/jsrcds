import * as eks from "@pulumi/eks";

interface Cluster {}

class EksCluster implements Cluster {
  constructor() {
    const cluster = new eks.Cluster("rcds-challenge-dev", {});
    return cluster.kubeconfig;
  }
}
