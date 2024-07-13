import path from "path";

import { getChallenges } from "./challenges";
import { FileLoader } from "./challenges/loader/file";

const { challenges, errors } = await getChallenges(
  new FileLoader({
    repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
  })
);

for (const error of errors) {
  console.error(error);
}
