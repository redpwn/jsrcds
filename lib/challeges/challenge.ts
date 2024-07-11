import path from "path";
import yaml from "yaml";

const getChallenge = async (globPath) => {
  const configPath = path.join(repoRoot, globPath);
  // full path to challenge dir
  const dir = path.dirname(configPath);
  // challenge dir in repo (category/name)
  const segment = path.dirname(globPath).replaceAll(path.sep, "/");
  if (!/^[a-z0-9/-]+$/.test(segment)) {
    throw new Error(`invalid challenge segment: ${segment}`);
  }
  const config = yaml.parse(await fs.promises.readFile(configPath, "utf8"));
  if (!validateConfig(config)) {
    const [error] = validateConfig.errors;
    throw new Error(
      `invalid config: ${segment}: ${error.instancePath}: ${error.message}`
    );
  }
  let flag;
  if (config.flag.file) {
    flag = (
      await fs.promises.readFile(path.join(dir, config.flag.file), "utf8")
    ).trim();
  } else {
    flag = config.flag;
  }
  const name = config.name ?? path.posix.basename(segment);
  const challenge = {
    configPath,
    segment,
    id: config.id ?? segment.toLowerCase().replaceAll("/", "-"),
    author: config.author.join?.(", ") ?? config.author,
    name,
    category: config.category ?? path.posix.dirname(segment),
    flag,
    value:
      typeof config.value === "number"
        ? { min: config.value, max: config.value }
        : config.value ?? rootConfig.scoreboard.rctf.defaultPoints,
    visible: config.visible ?? true,
    deployed: config.deployed ?? true,
    tiebreakEligible: config.tiebreakEligible ?? true,
    sortWeight: config.sortWeight ?? 0,
    provide: await Promise.all(
      (config.provide ?? []).map(async (entry) => {
        if (entry.url) {
          // dont upload file if url is provided
          return {
            name: entry.as ?? path.posix.basename(new URL(entry.url).pathname),
            url: entry.url,
          };
        }
        const filePath = path.join(dir, entry.file ?? entry);
        const name = entry.as ?? path.basename(filePath);
        const hash = await hashFile(filePath);
        const key = `${rootConfig.uploads.prefix}/${hash}/${name}`;
        return {
          name,
          filePath,
          key,
          url: `https://${getBucketHost(rootConfig.uploads.bucket)}/${key}`,
        };
      })
    ),
    containers: Object.fromEntries(
      Object.entries(config.containers ?? {}).map(([name, entry]) => [
        name,
        {
          image: entry.image,
          build: {
            context: entry.build?.context ?? entry.build,
            dockerfile: entry.build?.dockerfile ?? "Dockerfile",
            args: entry.build?.args,
          },
          ports: entry.ports ?? [],
          replicas: entry.replicas ?? 1,
          environment: entry.environment ?? {},
          resources: entry.resources,
          securityContext: {
            privileged: entry.securityContext?.privileged ?? false,
          },
        },
      ])
    ),
    expose: Object.fromEntries(
      Object.entries(config.expose ?? {}).map(([name, entries]) => [
        name,
        entries.map((entry) => {
          const expose = {
            target: entry.target,
            healthContent: entry.healthContent,
            rateLimit: entry.rateLimit,
          };
          if (entry.tcp) {
            if (isPrd) {
              expose.tcp = entry.tcp;
              expose.host = rootConfig.challengeHost;
            } else {
              // stg only supports tls, so convert tcp exposes
              expose.tls = {
                hostname: `${deployTag}-tcp${entry.tcp}.${rootConfig.challengeHost}`,
                // if alpn array is empty (https://github.com/traefik/traefik/blob/e54ee89330a800d509da7b11b46a6ecbb331e791/pkg/provider/kubernetes/crd/kubernetes.go#L884-L885)
                // traefik defaults to https://github.com/traefik/traefik/blob/e54ee89330a800d509da7b11b46a6ecbb331e791/pkg/tls/tlsmanager.go#L31
                alpn: [],
                entrypoint: "tcp",
              };
            }
          } else if (entry.http) {
            expose.http = isPrd
              ? `${entry.http}.${rootConfig.challengeHost}`
              : `${deployTag}-${entry.http}.${rootConfig.challengeHost}`;
          } else if (entry.tls) {
            const hostname = entry.tls.hostname ?? entry.tls;
            expose.tls = {
              hostname: isPrd
                ? `${hostname}.${rootConfig.challengeHost}`
                : `${deployTag}-${hostname}.${rootConfig.challengeHost}`,
              // most tls exposes will either not send the alpn extension or want http/1.1, so default to that
              alpn: entry.tls.alpn ?? ["http/1.1"],
              entrypoint: entry.tls.entrypoint ?? "tcp",
            };
          }
          return expose;
        }),
      ])
    ),
    instancer: config.instancer
      ? {
          name: config.instancer.name ?? name,
          timeout: config.instancer.timeout,
        }
      : undefined,
    adminbot: config.adminbot,
  };
  challenge.description = templateChallenge(challenge, config.description);
  return challenge;
};
