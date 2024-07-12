// import Ajv from "ajv/dist/jtd";
// import path from "path";

// import { loadYaml } from "../util";

// const ajv = new Ajv();

// const configSchema = loadYaml(path.join(__dirname, "config.schema.yaml"));
// const challengeSchema = loadYaml(path.join(__dirname, "challenge.schema.yaml"));

// export const validateConfig = ajv.compile(configSchema);
// export const validateChallengeConfig = ajv.compile(challengeSchema);

export { type IChallengeConfig, ChallengeConfig } from "./challenge";
