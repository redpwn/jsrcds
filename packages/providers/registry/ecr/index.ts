import * as awsx from "@pulumi/awsx";

const repo = new awsx.ecr.Repository("rcds-challenge-repo");
export const url = repo.url;
