import ExposeSchema from "./expose";

// Object.fromEntries(
//     Object.entries(config.expose ?? {}).map(([name, entries]: any) => [
//       name,
//       entries.map((entry: any) => {
//         const expose: any = {
//           target: entry.target,
//           healthContent: entry.healthContent,
//           rateLimit: entry.rateLimit,
//         };
//         if (entry.tcp) {
//           if (isPrd) {
//             expose.tcp = entry.tcp;
//             expose.host = rootConfig.challengeHost;
//           } else {
//             // stg only supports tls, so convert tcp exposes
//             expose.tls = {
//               hostname: `${deployTag}-tcp${entry.tcp}.${rootConfig.challengeHost}`,
//               // if alpn array is empty (https://github.com/traefik/traefik/blob/e54ee89330a800d509da7b11b46a6ecbb331e791/pkg/provider/kubernetes/crd/kubernetes.go#L884-L885)
//               // traefik defaults to https://github.com/traefik/traefik/blob/e54ee89330a800d509da7b11b46a6ecbb331e791/pkg/tls/tlsmanager.go#L31
//               alpn: [],
//               entrypoint: "tcp",
//             };
//           }
//         } else if (entry.http) {
//           expose.http = isPrd
//             ? `${entry.http}.${rootConfig.challengeHost}`
//             : `${deployTag}-${entry.http}.${rootConfig.challengeHost}`;
//         } else if (entry.tls) {
//           const hostname = entry.tls.hostname ?? entry.tls;
//           expose.tls = {
//             hostname: isPrd
//               ? `${hostname}.${rootConfig.challengeHost}`
//               : `${deployTag}-${hostname}.${rootConfig.challengeHost}`,
//             // most tls exposes will either not send the alpn extension or want http/1.1, so default to that
//             alpn: entry.tls.alpn ?? ["http/1.1"],
//             entrypoint: entry.tls.entrypoint ?? "tcp",
//           };
//         }
//         return expose;
//       }),
//     ])
//   )

/// VALIDATION
// for (const [name, exposes] of Object.entries(challenge.expose)) {
//     for (const [i, expose] of exposes.entries()) {
//       // TODO: move this check to kubernetes provider after moving plan stage to setup job
//       if (
//         rootConfig.deploy.kubernetes &&
//         expose.tcp !== undefined &&
//         (expose.tcp < 30000 || expose.tcp > 32767)
//       ) {
//         throw new Error(
//           `invalid tcp port: ${challenge.segment}/${name}/${i}: ${expose.tcp}`
//         );
//       }
//     }
//   }

// GLOBAL VALIDATION

// for (const [name, exposes] of Object.entries(challenge.expose)) {
//     for (const [i, expose] of exposes.entries()) {
//       const id = `${challenge.segment}/${name}/${i}`;
//       if (expose.tcp) {
//         if (ports.has(expose.tcp)) {
//           throw new Error(`duplicate tcp port: ${id}: ${expose.tcp}`);
//         }
//         ports.add(expose.tcp);
//       }
//       if (expose.http) {
//         if (hosts.has(expose.http)) {
//           throw new Error(`duplicate http host: ${id}: ${expose.http}`);
//         }
//         hosts.add(expose.http);
//       }
//       if (expose.tls) {
//         if (hosts.has(expose.tls)) {
//           throw new Error(`duplicate tls host: ${id}: ${expose.tls}`);
//         }
//         hosts.add(expose.tls);
//       }
//     }
//   }

import { Plugin, ResourceBlockConfig } from "..";

export class ExposePlugin extends Plugin {
  public readonly name = "expose";

  public getChallengeConfigSchema() {
    return {};
  }
}

export class ExposeBlockConfig extends ResourceBlockConfig<any> {
  public key = "expose";
  public schema = ExposeSchema;
}
