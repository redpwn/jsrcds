import Ajv, { JTDDataType } from "ajv/dist/jtd";

const ajv = new Ajv();
const challengeSchema = yaml.parse(
  await fs.promises.readFile(
    path.join(repoRoot, "deploy/jsrcds/challenge.schema.yaml"),
    "utf8"
  )
);
const validateConfig = ajv.compile(challengeSchema);
