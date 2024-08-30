import * as pulumi from "@pulumi/pulumi";
import got from "got";
import type { ChallengeObject, Scoreboard } from "../../resources/scoreboard";

let authToken: string = "";
let prefixUrl: string = "";
let cachedFetchClient: Got = null; // FIXME: fix got types

const loadFetchClient = () => {
  return got.extend({
    prefixUrl: prefixUrl, 
    headers: { authorization: `Bearer ${authToken}` },
    resolveBodyOnly: true,
    responseType: "json",
  });
};

const fetchClient = async (...rest: unknown[]) => {
  if (!cachedFetchClient) {
    cachedFetchClient = loadFetchClient();
  }
  return (cachedFetchClient)(...rest);
};

// dynamic providers require pulumi input wrapped types for resources and unwrapped types for providers
interface ChallengeFileRaw {
  name: string,
  url: string
}

export interface RctfChallengeRaw {
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
  files: ChallengeFileRaw[]
}

interface ChallengeFile {
  name: pulumi.Input<string>,
  url: pulumi.Input<string>
}

export interface RctfChallenge extends ChallengeObject {
	name: pulumi.Input<string>,
	description: pulumi.Input<string>,
	id: pulumi.Input<string>,
	author: pulumi.Input<string>,
	category: pulumi.Input<string>,
	points: {
		min: pulumi.Input<Number>,
		max: pulumi.Input<Number>,
	},
	flag: pulumi.Input<string>,
  tiebreakEligible: pulumi.Input<boolean>,
  sortWeight: pulumi.Input<boolean>,
  files: ChallengeFile[]
}

class RctfChallengeProvider implements pulumi.dynamic.ResourceProvider  {
  async create(challenge: RctfChallengeRaw): Promise<pulumi.dynamic.CreateResult> {
    const { kind, data } = await fetchClient({
      url: `challs/${encodeURIComponent(challenge.id)}`,
      method: "PUT",
      json: { data: challenge },
    });
    if (kind !== "goodChallengeUpdate") {
      throw new Error(`rctf error: ${kind}`);
    }

    return { id: data.id.toString(), outs: data };
  }

  async read(challengeId: string, props: {}) {
    const { kind, data } = await fetchClient(`challs/${encodeURIComponent(challengeId)}`);
    if (kind !== "goodChallenges") {
      throw new Error(`rctf error: ${kind}`);
    }

    return { id: data.id.toString(), outs: data };
  }

  async update(challengeId: string, oldChallenge: RctfChallengeRaw, newChallenge: RctfChallengeRaw) {
    const { kind, data } = await fetchClient({
      url: `challs/${encodeURIComponent(challengeId)}`,
      method: "PUT",
      json: { data: newChallenge },
    });
    if (kind !== "goodChallengeUpdate") {
      throw new Error(`rctf error: ${kind}`);
    }

    return { outs: data };
  }

  async delete(id: string, props: {}) {
    const { kind } = await fetchClient({
      url: `challs/${encodeURIComponent(id)}`,
      method: "DELETE",
    });
    if (kind !== "goodChallengeDelete") {
      throw new Error(`rctf error: ${kind}`);
    }
  }
}

class RctfChallengeResource extends pulumi.dynamic.Resource {
    constructor(name: string, challengeProps: RctfChallengeRaw, opts?: pulumi.CustomResourceOptions) {
        super(RctfChallengeProvider, name, challengeProps, opts);
    }
}

export class RctfScoreboard implements Scoreboard {
  constructor(rctfToken: string, apiBase: string) {
    authToken = rctfToken;
    prefixUrl = apiBase;
  }

  createChallenge(challenge: RctfChallengeRaw) {
    new RctfChallengeResource(challenge.name, challenge);
  }
}