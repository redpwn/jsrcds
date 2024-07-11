import yaml from "yaml";
import got from "got";
import github from "@actions/github";
import { auth as googleAuth } from "google-auth-library";
import { ClusterManagerClient } from "@google-cloud/container";
import k8s from "@kubernetes/client-node";
import config from "../../config.js";
import {
  isPrd,
  deployTag,
  compareMaps,
  deepCompare,
  isSpeculative,
} from "../../util.js";

const getKubeConfig = async () => {
  const clusterManager = new ClusterManagerClient({ authClient: googleAuth });
  const [cluster] = await clusterManager.getCluster({
    name: `projects/${config.googleProject}/locations/${config.googleZone}/clusters/${config.deploy.kubernetes.clusterName}`,
  });
  const kc = new k8s.KubeConfig();
  kc.addCluster({
    name: "ctf",
    caData: cluster.masterAuth.clusterCaCertificate,
    server: `https://${cluster.endpoint}`,
  });
  kc.addUser({ name: "ctf", token: await googleAuth.getAccessToken() });
  kc.addContext({ name: "ctf", cluster: "ctf", user: "ctf" });
  kc.setCurrentContext("ctf");
  return kc;
};
let kubeConfig;
const kubeApiClients = new Map();
const getKubeClient = async (api) => {
  if (!kubeConfig) {
    kubeConfig = getKubeConfig();
  }
  if (!kubeApiClients.has(api)) {
    kubeApiClients.set(api, (await kubeConfig).makeApiClient(api));
  }
  return kubeApiClients.get(api);
};

const labels = {
  managedBy: "app.kubernetes.io/managed-by",
  challenge: "jsrcds.dicega.ng/challenge",
  container: "jsrcds.dicega.ng/container",
  deployTag: "jsrcds.dicega.ng/deploy-tag",
};
const annotations = {
  lastConfig: "jsrcds.dicega.ng/last-config",
};
const managedBy = "jsrcds";
const kloddApi = ["klodd.tjcsec.club", "v1"];
const traefikApi = ["traefik.containo.us", "v1alpha1"];
const kloddChallengeType = "challenges";
const traefikIngressRouteType = "ingressroutes";
const traefikIngressRouteTcpType = "ingressroutetcps";
const traefikTlsOptionType = "tlsoptions";
const planTypes = {
  create: "create",
  update: "update",
  delete: "delete",
};
const resourceTypes = {
  namespace: "namespaces",
  deployment: "deployments.apps",
  service: "services",
  networkPolicy: "networkpolicies.networking.k8s.io",
  kloddChallenge: "challenges.klodd.tjcsec.club",
  traefikIngressRoute: "ingressroutes.traefik.containo.us",
  traefikIngressRouteTcp: "ingressroutetcps.traefik.containo.us",
  traefikTlsOption: "tlsoptions.traefik.containo.us",
};

const getChallengeLabels = (challenge) => ({
  [labels.managedBy]: managedBy,
  [labels.challenge]: challenge.id,
  [labels.deployTag]: deployTag,
});
const getContainerLabels = (challenge, name) => ({
  ...getChallengeLabels(challenge),
  [labels.container]: name,
});
const getNamespaceName = (challenge) => `jsrcds-${deployTag}-${challenge.id}`;

const getStateResources = async () => {
  const kCore = await getKubeClient(k8s.CoreV1Api);
  const kApps = await getKubeClient(k8s.AppsV1Api);
  const kNetworking = await getKubeClient(k8s.NetworkingV1Api);
  const kCustom = await getKubeClient(k8s.CustomObjectsApi);
  const selector = `${labels.managedBy}=${managedBy}`;
  const [
    namespaces,
    deployments,
    services,
    networkPolicies,
    kloddChallenges,
    traefikIngressRoutes,
    traefikIngressRouteTcps,
    traefikTlsOptions,
  ] = await Promise.all([
    kCore.listNamespace(undefined, undefined, undefined, undefined, selector),
    kApps.listDeploymentForAllNamespaces(
      undefined,
      undefined,
      undefined,
      selector
    ),
    kCore.listServiceForAllNamespaces(
      undefined,
      undefined,
      undefined,
      selector
    ),
    kNetworking.listNetworkPolicyForAllNamespaces(
      undefined,
      undefined,
      undefined,
      selector
    ),
    kCustom.listClusterCustomObject(
      ...kloddApi,
      kloddChallengeType,
      undefined,
      undefined,
      undefined,
      undefined,
      selector
    ),
    kCustom.listClusterCustomObject(
      ...traefikApi,
      traefikIngressRouteType,
      undefined,
      undefined,
      undefined,
      undefined,
      selector
    ),
    kCustom.listClusterCustomObject(
      ...traefikApi,
      traefikIngressRouteTcpType,
      undefined,
      undefined,
      undefined,
      undefined,
      selector
    ),
    kCustom.listClusterCustomObject(
      ...traefikApi,
      traefikTlsOptionType,
      undefined,
      undefined,
      undefined,
      undefined,
      selector
    ),
  ]);
  const resources = new Map();
  for (const namespace of namespaces.body.items) {
    const get = (type, list) =>
      list.body.items
        .filter((it) => it.metadata.namespace === namespace.metadata.name)
        .map((it) => [`${type}/${it.metadata.name}`, it]);
    resources.set(
      namespace.metadata.name,
      new Map([
        [resourceTypes.namespace, namespace],
        ...get(resourceTypes.deployment, deployments),
        ...get(resourceTypes.service, services),
        ...get(resourceTypes.networkPolicy, networkPolicies),
        ...get(resourceTypes.kloddChallenge, kloddChallenges),
        ...get(resourceTypes.traefikIngressRoute, traefikIngressRoutes),
        ...get(resourceTypes.traefikIngressRouteTcp, traefikIngressRouteTcps),
        ...get(resourceTypes.traefikTlsOption, traefikTlsOptions),
      ])
    );
  }
  return resources;
};

const getNamespaces = (challenge) =>
  new Map([
    [
      resourceTypes.namespace,
      {
        metadata: {
          name: getNamespaceName(challenge),
          labels: getChallengeLabels(challenge),
        },
      },
    ],
  ]);

const resolveDockerRef = async (segment, name) => {
  const tag = isSpeculative ? "latest" : `sha-${github.context.sha}`;
  const pathname = `${config.images.challengesBase}/${segment}/${name}`;
  const res = await got({
    url: `https://${config.images.registry}/v2/${pathname}/manifests/${tag}`,
    method: "HEAD",
    headers: { accept: "*/*" },
    username: "oauth2accesstoken",
    password: await googleAuth.getAccessToken(),
  });
  return `${config.images.registry}/${pathname}@${res.headers["docker-content-digest"]}`;
};

const getPodSpec = async (challenge, containerName, container) => ({
  automountServiceAccountToken: false,
  enableServiceLinks: false,
  containers: [
    {
      name: containerName,
      image:
        container.image ??
        (await resolveDockerRef(challenge.segment, containerName)),
      ports: container.ports.map((port) => ({ containerPort: port })),
      env: Object.entries(container.environment).map(([name, value]) => ({
        name,
        value,
      })),
      securityContext: container.securityContext,
      resources: {
        requests:
          container.resources?.requests ??
          config.deploy.kubernetes.defaultResources.requests,
        limits:
          container.resources?.limits ??
          config.deploy.kubernetes.defaultResources.limits,
      },
    },
  ],
});

const getDeployments = async (challenge) => {
  const deployments = new Map();
  for (const [name, container] of Object.entries(challenge.containers)) {
    const labels = getContainerLabels(challenge, name);
    deployments.set(`${resourceTypes.deployment}/${name}`, {
      metadata: {
        name,
        labels,
        namespace: getNamespaceName(challenge),
      },
      spec: {
        replicas: container.replicas,
        selector: { matchLabels: labels },
        template: {
          metadata: { labels },
          spec: await getPodSpec(challenge, name, container),
        },
      },
    });
  }
  return deployments;
};

const getServices = (challenge) => {
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

const getTraefikResources = (challenge) => {
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
};

const getNetworkPolicies = (challenge) => {
  const labels = getChallengeLabels(challenge);
  return new Map([
    [
      `${resourceTypes.networkPolicy}/challenge`,
      {
        metadata: {
          name: "challenge",
          labels,
          namespace: getNamespaceName(challenge),
        },
        spec: {
          podSelector: { matchLabels: labels },
          policyTypes: ["Egress"],
          egress: [
            {
              to: [
                {
                  namespaceSelector: { matchLabels: labels },
                },
                {
                  ipBlock: {
                    cidr: "0.0.0.0/0",
                    // https://github.com/python/cpython/blob/f4888315769a2267d9a1351cf182ebef0ae9c4b5/Lib/ipaddress.py#L1551-L1566
                    // removed 0.0.0.0/8 and 127.0.0.0/8
                    except: [
                      "10.0.0.0/8",
                      "169.254.0.0/16",
                      "172.16.0.0/12",
                      "192.0.0.0/29",
                      "192.0.0.170/31",
                      "192.0.2.0/24",
                      "192.168.0.0/16",
                      "198.18.0.0/15",
                      "198.51.100.0/24",
                      "203.0.113.0/24",
                      "240.0.0.0/4",
                      "255.255.255.255/32",
                    ],
                  },
                },
              ],
            },
            {
              // metadata ip serves dns when gke cloud dns is enabled
              // TODO: support kube-dns
              to: [
                {
                  ipBlock: {
                    cidr: "169.254.169.254/32",
                  },
                },
              ],
              ports: [
                {
                  protocol: "UDP",
                  port: 53,
                },
                {
                  protocol: "TCP",
                  port: 53,
                },
              ],
            },
          ],
        },
      },
    ],
  ]);
};

const getKloddChallenges = async (challenge) => {
  // schema already validates that each klodd challenge has only one expose
  const expose = Object.values(challenge.expose)[0][0];
  const exposeName = Object.keys(challenge.expose)[0];
  // strip off the challenge host
  const hostname = (expose.http ?? expose.tls.hostname).slice(
    0,
    -config.challengeHost.length - 1
  );
  const kloddName = isPrd ? hostname : `${deployTag}-${hostname}`;
  const pods = [];
  for (const [name, container] of Object.entries(challenge.containers)) {
    pods.push({
      egress: true,
      name,
      ports: container.ports.map((port) => ({ port })),
      spec: await getPodSpec(challenge, name, container),
    });
  }
  return new Map([
    [
      `${resourceTypes.kloddChallenge}/${kloddName}`,
      {
        kind: "Challenge",
        apiVersion: kloddApi.join("/"),
        metadata: {
          name: kloddName,
          labels: getChallengeLabels(challenge),
          namespace: getNamespaceName(challenge),
        },
        spec: {
          name: challenge.instancer.name,
          timeout: challenge.instancer.timeout,
          expose: {
            kind: expose.http ? "http" : "tcp",
            pod: exposeName,
            port: expose.target,
          },
          pods,
        },
      },
    ],
  ]);
};

const getConfigResources = async (challenges) => {
  const resources = new Map();
  await Promise.all(
    challenges.map(async (challenge) => {
      if (
        !challenge.deployed ||
        Object.keys(challenge.containers).length === 0
      ) {
        return;
      }
      if (challenge.instancer) {
        resources.set(
          getNamespaceName(challenge),
          new Map([
            ...getNamespaces(challenge),
            ...(await getKloddChallenges(challenge)),
          ])
        );
      } else {
        resources.set(
          getNamespaceName(challenge),
          new Map([
            ...getNamespaces(challenge),
            ...(await getDeployments(challenge)),
            ...getServices(challenge),
            ...getNetworkPolicies(challenge),
            ...getTraefikResources(challenge),
          ])
        );
      }
    })
  );
  return resources;
};

export const createPlan = async (challenges) => {
  const plan = [];
  const oldResources = await getStateResources();
  const newResources = await getConfigResources(challenges);
  const [addedNs, removedNs, commonNs] = compareMaps(
    oldResources,
    newResources
  );
  for (const [, resources] of removedNs) {
    // deleting namespace deletes all child resources
    plan.push({
      type: planTypes.delete,
      name: resourceTypes.namespace,
      resource: resources.get(resourceTypes.namespace),
    });
  }
  for (const [, resources] of addedNs) {
    for (const [name, resource] of resources) {
      plan.push({ type: planTypes.create, name, resource });
    }
  }
  for (const [, [oldInNs, newInNs]] of commonNs) {
    const [added, removed, common] = compareMaps(oldInNs, newInNs);
    for (const [name, resource] of removed) {
      plan.push({ type: planTypes.delete, name, resource });
    }
    for (const [name, resource] of added) {
      plan.push({ type: planTypes.create, name, resource });
    }
    for (const [name, [oldResource, newResource]] of common) {
      const lastConfig = JSON.parse(
        oldResource.metadata.annotations?.[annotations.lastConfig] ?? "{}"
      );
      if (!deepCompare(lastConfig, newResource)) {
        plan.push({
          type: planTypes.update,
          name,
          resource: newResource,
          resourceVersion: oldResource.metadata.resourceVersion,
        });
      }
    }
  }
  return plan;
};

const formatName = (resource, name) => {
  if (name === resourceTypes.namespace) {
    return resource.metadata.name;
  }
  return `${resource.metadata.namespace}: ${name}`;
};

const formatResource = (resource, name) => `
<details>
  <summary>${formatName(resource, name)}</summary>

\`\`\`yaml
${yaml.stringify(resource)}
\`\`\`

</details>
`;

export const formatPlan = (plan) => {
  if (plan.length === 0) {
    return "No changes";
  }
  const deleted = [];
  const updated = [];
  const created = [];
  for (const { type, resource, name } of plan) {
    if (type === planTypes.delete) {
      deleted.push(`- ${formatName(resource, name)}`);
    } else if (type === planTypes.update) {
      updated.push(formatResource(resource, name));
    } else if (type === planTypes.create) {
      created.push(formatResource(resource, name));
    }
  }
  return [
    deleted.length > 0 ? "### Delete" : "",
    ...deleted,
    updated.length > 0 ? "### Update" : "",
    ...updated,
    created.length > 0 ? "### Create" : "",
    ...created,
  ].join("\n");
};

export const applyPlan = async (plan) => {
  const kCore = await getKubeClient(k8s.CoreV1Api);
  const kApps = await getKubeClient(k8s.AppsV1Api);
  const kNetworking = await getKubeClient(k8s.NetworkingV1Api);
  const kCustom = await getKubeClient(k8s.CustomObjectsApi);
  for (const { type, name, resource, resourceVersion } of plan) {
    // TODO: dont mutate plan
    if (type === planTypes.create || type === planTypes.update) {
      resource.metadata.annotations = {
        ...resource.metadata.annotations,
        [annotations.lastConfig]: JSON.stringify(resource),
      };
    }
    if (resourceVersion) {
      resource.metadata.resourceVersion = resourceVersion;
    }
    const [resourceType] = name.split("/");
    switch (resourceType) {
      case resourceTypes.namespace:
        switch (type) {
          case planTypes.create:
            await kCore.createNamespace(resource);
            break;
          case planTypes.delete:
            await kCore.deleteNamespace(resource.metadata.name);
            break;
          case planTypes.update:
            await kCore.replaceNamespace(resource.metadata.name, resource);
            break;
        }
        break;
      case resourceTypes.deployment:
        switch (type) {
          case planTypes.create:
            await kApps.createNamespacedDeployment(
              resource.metadata.namespace,
              resource
            );
            break;
          case planTypes.delete:
            await kApps.deleteNamespacedDeployment(
              resource.metadata.name,
              resource.metadata.namespace
            );
            break;
          case planTypes.update:
            await kApps.replaceNamespacedDeployment(
              resource.metadata.name,
              resource.metadata.namespace,
              resource
            );
            break;
        }
        break;
      case resourceTypes.service:
        switch (type) {
          case planTypes.create:
            await kCore.createNamespacedService(
              resource.metadata.namespace,
              resource
            );
            break;
          case planTypes.delete:
            await kCore.deleteNamespacedService(
              resource.metadata.name,
              resource.metadata.namespace
            );
            break;
          case planTypes.update:
            await kCore.replaceNamespacedService(
              resource.metadata.name,
              resource.metadata.namespace,
              resource
            );
            break;
        }
        break;
      case resourceTypes.networkPolicy:
        switch (type) {
          case planTypes.create:
            await kNetworking.createNamespacedNetworkPolicy(
              resource.metadata.namespace,
              resource
            );
            break;
          case planTypes.delete:
            await kNetworking.deleteNamespacedNetworkPolicy(
              resource.metadata.name,
              resource.metadata.namespace
            );
            break;
          case planTypes.update:
            await kNetworking.replaceNamespacedNetworkPolicy(
              resource.metadata.name,
              resource.metadata.namespace,
              resource
            );
            break;
        }
        break;
      case resourceTypes.kloddChallenge:
        switch (type) {
          case planTypes.create:
            await kCustom.createNamespacedCustomObject(
              ...kloddApi,
              resource.metadata.namespace,
              kloddChallengeType,
              resource
            );
            break;
          case planTypes.delete:
            await kCustom.deleteNamespacedCustomObject(
              ...kloddApi,
              resource.metadata.namespace,
              kloddChallengeType,
              resource.metadata.name
            );
            break;
          case planTypes.update:
            await kCustom.replaceNamespacedCustomObject(
              ...kloddApi,
              resource.metadata.namespace,
              kloddChallengeType,
              resource.metadata.name,
              resource
            );
            break;
        }
        break;
      case resourceTypes.traefikIngressRoute:
        switch (type) {
          case planTypes.create:
            await kCustom.createNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteType,
              resource
            );
            break;
          case planTypes.delete:
            await kCustom.deleteNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteType,
              resource.metadata.name
            );
            break;
          case planTypes.update:
            await kCustom.replaceNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteType,
              resource.metadata.name,
              resource
            );
            break;
        }
        break;
      case resourceTypes.traefikIngressRouteTcp:
        switch (type) {
          case planTypes.create:
            await kCustom.createNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteTcpType,
              resource
            );
            break;
          case planTypes.delete:
            await kCustom.deleteNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteTcpType,
              resource.metadata.name
            );
            break;
          case planTypes.update:
            await kCustom.replaceNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikIngressRouteTcpType,
              resource.metadata.name,
              resource
            );
            break;
        }
        break;
      case resourceTypes.traefikTlsOption:
        switch (type) {
          case planTypes.create:
            await kCustom.createNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikTlsOptionType,
              resource
            );
            break;
          case planTypes.delete:
            await kCustom.deleteNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikTlsOptionType,
              resource.metadata.name
            );
            break;
          case planTypes.update:
            await kCustom.replaceNamespacedCustomObject(
              ...traefikApi,
              resource.metadata.namespace,
              traefikTlsOptionType,
              resource.metadata.name,
              resource
            );
            break;
        }
        break;
    }
  }
};
