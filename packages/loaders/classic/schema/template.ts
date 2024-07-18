// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import crypto from "crypto";
import fs from "fs";
import handlebars from "handlebars";

import { type ChallengeConfig } from "../schemas";

interface DescriptionModel {
  host?: string;

  url?: string;
  link?: string; // clickable URL

  port?: string;
  nc?: string;

  challenge: ChallengeConfig;
}

const templateDescription = (
  challenge: ChallengeConfig,
  description: string,
) => {
  const model: DescriptionModel = { challenge };
  if (challenge.expose) {
    const exposes = Object.values(challenge.expose).flat();
    // only one expose; add unambiguous shortcuts to model
    if (exposes.length === 1) {
      model.host =
        exposes[0]?.http ?? exposes[0]?.host ?? exposes[0]?.tls.hostname;
    }
    const http = exposes.filter((ex) => ex.http);
    if (http.length === 1) {
      model.url = `https://${http[0].http}`;
      model.link = `[${http[0].http}](${model.url})`;
    }
    const tcp = exposes.filter((ex) => ex.tcp);
    if (tcp.length === 1) {
      model.port = tcp[0].tcp;
      model.nc = `nc ${tcp[0].host} ${model.port}`;
    }
    const tls = exposes.filter((ex) => ex.tls);
    if (tls.length === 1) {
      model.port = tlsPort;
      model.nc = `socat - openssl:${tls[0].tls.hostname}:${model.port}`;
      if (tls[0].tls.entrypoint === "https") {
        model.url = `https://${tls[0].tls.hostname}`;
        model.link = `[${tls[0].tls.hostname}](${model.url})`;
      }
    }
  }

  return handlebars.compile(description)(model);
};
