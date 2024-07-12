import path from "path";

import { getChallenges } from "./challenges";

const { challenges, errors } = await getChallenges(
  path.join(process.cwd(), "tests/examples/testctf")
);
for (const error of errors) {
  console.error(error);
}
