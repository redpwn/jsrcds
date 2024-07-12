import path from "path";

import { getChallenges } from "./challenges";
import { RepoLoader } from "./challenges/loader/repo";

const { challenges, errors } = await getChallenges(new RepoLoader(), {
  repoRoot: path.join(process.cwd(), "tests/examples/testctf"),
});

for (const error of errors) {
  console.error(error);
}
