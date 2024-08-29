import type { Runtime, RuntimeDeployment } from "@rcds/resource-runtime";

import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export class K8SDeployment extends pulumi.ComponentResource {
  constructor(name: string, opts: pulumi.ComponentResourceOptions) {
    super("rcds:k8s:Deployment", name, {}, opts);
  }
}

export class K8SCluster implements Runtime {
  labels = {
    managedBy: "app.kubernetes.io/managed-by",
    challenge: "jsrcds.dicega.ng/challenge",
    container: "jsrcds.dicega.ng/container",
    deployTag: "jsrcds.dicega.ng/deploy-tag",
  };

  resourceTypes = {
    namespace: "namespaces",
    deployment: "deployments.apps",
    service: "services",
    networkPolicy: "networkpolicies.networking.k8s.io",
    kloddChallenge: "challenges.klodd.tjcsec.club",
    traefikIngressRoute: "ingressroutes.traefik.containo.us",
    traefikIngressRouteTcp: "ingressroutetcps.traefik.containo.us",
    traefikTlsOption: "tlsoptions.traefik.containo.us",
  };

  managedBy = "jsrcds";

  getChallengeLabels = (challenge: any, deployTag: any) => ({
    [this.labels.managedBy]: this.managedBy,
    [this.labels.challenge]: challenge.id,
    [this.labels.deployTag]: deployTag,
  });

  getContainerLabels = (challenge: any, deployTag: any, name: any) => ({
    ...this.getChallengeLabels(challenge, deployTag),
    [this.labels.container]: name,
  });

  deployChallengeContainers(deployment: RuntimeDeployment) {
    const challengeDeployment = new K8SDeployment(deployment.id, {});
    const namespace = this.createNamespace(deployment);
  }

  getNamespaceName(deployment: RuntimeDeployment) {
    return `jsrcds-${deployment.id}`;
  }

  createNamespace(deployment: RuntimeDeployment) {
    return new k8s.core.v1.Namespace(deployment.id, {
      metadata: {
        name: this.getNamespaceName(deployment),
        labels: this.labels,
      },
    });
  }

  createDeployments(deployment: RuntimeDeployment) {
    for (const [name, container] of Object.entries(deployment.containers)) {
      const labels = this.getContainerLabels(deployment, "", name);
      new k8s.apps.v1.Deployment(deployment.id, {
        metadata: {
          name,
          labels,
          namespace: this.getNamespaceName(deployment),
        },
        spec: {
          replicas: container.replicas,
          selector: { matchLabels: labels },
          template: {
            metadata: { labels },
            spec: this.getPodSpec(deployment, name, container),
          },
        },
      });
    }
  }

  getPodSpec = async (deployment: RuntimeDeployment) => ({
    // automountServiceAccountToken: false,
    // enableServiceLinks: false,
    // containers: [
    //   {
    //     name: container.name,
    //     image: container.image,
    //     ports: container.ports.map((port) => ({ containerPort: port })),
    //     env: Object.entries(container.environment).map(([name, value]) => ({
    //       name,
    //       value,
    //     })),
    //     securityContext: container.securityContext,
    //     resources: {
    //       requests:
    //         container.resources?.requests ??
    //         config.deploy.kubernetes.defaultResources.requests,
    //       limits:
    //         container.resources?.limits ??
    //         config.deploy.kubernetes.defaultResources.limits,
    //     },
    //   },
    // ],
  });

  createServices(deployment: RuntimeDeployment) {
    for (const [name, container] of Object.entries(deployment.containers)) {
      const labels = this.getContainerLabels(deployment, "", name);
      new k8s.apps.v1.Deployment(deployment.id, {
        metadata: {
          name,
          labels,
          namespace: this.getNamespaceName(deployment),
        },
        spec: {
          replicas: container.replicas,
          selector: { matchLabels: labels },
          template: {
            metadata: { labels },
            spec: this.getPodSpec(deployment),
          },
        },
      });
    }
  }

  getServices = (challenge) => {
    const services = new Map();
    // every port on a NodePort service must be assigned on a nodePort, so we separate
    // exposes into ClusterIP (for intra-challenge use) and NodePort (for TCP exposes)
    for (const [name, exposes] of Object.entries(challenge.expose)) {
      const labels = getContainerLabels(challenge, name);
      const tcp = exposes.filter((ex) => ex.tcp);
      if (tcp.length === 0) {
        continue;
      }
      services.set(`${resourceTypes.service}/${name}-tcp`, {
        metadata: {
          name: `${name}-tcp`,
          labels,
          namespace: getNamespaceName(challenge),
        },
        spec: {
          type: "NodePort",
          selector: labels,
          ports: tcp.map((ex) => ({
            port: ex.target,
            nodePort: ex.tcp,
          })),
        },
      });
    }
    for (const [name, container] of Object.entries(challenge.containers)) {
      const labels = getContainerLabels(challenge, name);
      services.set(`${resourceTypes.service}/${name}`, {
        metadata: {
          name,
          labels,
          namespace: getNamespaceName(challenge),
        },
        spec: {
          type: "ClusterIP",
          selector: labels,
          ports: container.ports.map((port) => ({ port })),
        },
      });
    }
    return services;
  };

  createTraefikResources() {
    const resources = new Map();
    const namespace = getNamespaceName(challenge);
    for (const [containerName, exposes] of Object.entries(challenge.expose)) {
      const labels = getContainerLabels(challenge, containerName);
      for (const [i, expose] of exposes.entries()) {
        const name = `${containerName}-${i}`;
        if (expose.http) {
          const middlewares = [
            {
              name: "restrict",
              namespace: "traefik",
            },
          ];
          if (expose.rateLimit) {
            middlewares.push({
              name: "ratelimit",
              namespace: "traefik",
            });
          }
          resources.set(`${resourceTypes.traefikIngressRoute}/${name}`, {
            kind: "IngressRoute",
            apiVersion: traefikApi.join("/"),
            metadata: {
              name,
              labels,
              namespace,
            },
            spec: {
              entryPoints: ["http", "https"],
              routes: [
                {
                  kind: "Rule",
                  match: `Host(\`${expose.http}\`)`,
                  middlewares,
                  services: [
                    {
                      kind: "Service",
                      name: containerName,
                      port: expose.target,
                    },
                  ],
                },
              ],
            },
          });
        } else if (expose.tls) {
          resources.set(`${resourceTypes.traefikIngressRouteTcp}/${name}`, {
            kind: "IngressRouteTCP",
            apiVersion: traefikApi.join("/"),
            metadata: {
              name,
              labels,
              namespace,
            },
            spec: {
              entryPoints: [expose.tls.entrypoint],
              routes: [
                {
                  kind: "Rule",
                  match: `HostSNI(\`${expose.tls.hostname}\`)`,
                  middlewares: [
                    {
                      name: "restrict",
                      namespace: "traefik",
                    },
                  ],
                  services: [
                    {
                      kind: "Service",
                      name: containerName,
                      port: expose.target,
                    },
                  ],
                },
              ],
              tls: {
                options: {
                  name,
                  namespace,
                },
              },
            },
          });
          resources.set(`${resourceTypes.traefikTlsOption}/${name}`, {
            kind: "TLSOption",
            apiVersion: traefikApi.join("/"),
            metadata: {
              name,
              labels,
              namespace,
            },
            spec: {
              alpnProtocols: expose.tls.alpn,
            },
          });
        }
      }
    }
    return resources;
  }
}
