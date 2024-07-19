// dotenv
import dotenv from "dotenv";
dotenv.config();

import yaml from "yaml";
import fs from "fs";
import { configSchema } from "./schema";

const config = configSchema.parse(
  yaml.parse(fs.readFileSync(process.env.CONFIG_PATH || "config.yml", "utf8"))
);

export default config;
