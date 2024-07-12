import path from "path";
import fs from "fs";
import { Challenge } from "./challenge";

// TODO: please modularize
export const loadChallenge = async (challenge: Challenge, config: any) => {
  const dir = challenge.dir;
  const segment = challenge.segment;
  const configPath = challenge.configPath;

  let flag;
  if (config.flag.file) {
    flag = (
      await fs.promises.readFile(path.join(dir, config.flag.file), "utf8")
    ).trim();
  } else {
    flag = config.flag;
  }
  const name = config.name ?? path.posix.basename(segment);
  const newChallenge: any = {
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
    provide: [],
    containers: Object.fromEntries(
      Object.entries(config.containers ?? {}).map(([name, entry]: any) => [
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
      Object.entries(config.expose ?? {}).map(([name, entries]: any) => [
        name,
        entries.map((entry: any) => {
          const expose: any = {
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
  };
  newChallenge.description = templateChallenge(challenge, config.description);
  return newChallenge;
};
