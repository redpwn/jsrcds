// import { Plugin } from "../../../../lib/plugin";

// export class Rctf extends Plugin {
//   public readonly name = "rctf";
// }
import { auth as googleAuth } from "google-auth-library";
import got from "got";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import config from "../../config.js";
import { isSpeculative } from "../../../lib/util.js";

import type { ChallengeObject, Scoreboard } from "../../resources/scoreboard";

interface ChallengeFile {
  name: string,
  url: string
}

type Method = "GET" | "PUSH" | "PUT" | "DELETE";

interface Payload {
  url: string,
  method: Method,
  json?: any
}

export interface RctfChallenge extends ChallengeObject {
	name: string,
	description: string,
	id: string,
	author: string,
	category: string,
	points: {
		min: Number,
		max: Number,
	},
	flag: string,
  tiebreakEligible: boolean,
  sortWeight: boolean,
  files: ChallengeFile[]
}

export class RctfScoreboard implements Scoreboard {
  savedReq: any;

  async getReq() {
    const secretManager = new SecretManagerServiceClient({
      authClient: googleAuth,
    });
    const secretName = isSpeculative
      ? config.scoreboard.rctf.tokenNames.read
      : config.scoreboard.rctf.tokenNames.write;
    const [secret] = await secretManager.accessSecretVersion({
      name: secretManager.secretVersionPath(
        config.googleProject,
        secretName,
        "latest"
      ),
    });
    return got.extend({
      prefixUrl: `${config.scoreboard.rctf.url}/api/v1/admin`,
      headers: { authorization: `Bearer ${secret.payload.data.toString()}` },
      resolveBodyOnly: true,
      responseType: "json",
    });
  };

  async req(...rest: Payload[]) {
    if (!this.savedReq) {
      this.savedReq = this.getReq();
    }
    return (await this.savedReq)(...rest);
  };

  async createChallenge(challenge: RctfChallenge): Promise<void> {
    const { kind } = await this.req({
      url: `challs/${encodeURIComponent(challenge.id)}`,
      method: "PUT",
      json: { data: challenge },
    });
    if (kind !== "goodChallengeUpdate") {
      throw new Error(`rctf error: ${kind}`);
    }
  }
}