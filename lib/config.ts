import path from "path";
import fs from "fs";
import yaml from "yaml";
import Ajv from "ajv";
import { repoRoot } from "./util.js";

const readYaml = async (file) =>
  yaml.parse(
    await fs.promises.readFile(
      path.join(repoRoot, "deploy/jsrcds", file),
      "utf8"
    )
  );
const validate = new Ajv().compile(await readYaml("config.schema.yaml"));
const config = await readYaml("config.yaml");
if (!validate(config)) {
  const [error] = validate.errors;
  throw new Error(`invalid config: ${error.instancePath}: ${error.message}`);
}

export default config;
