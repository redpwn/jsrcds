import { getChallenges } from "./challenges";

const { challenges, errors } = await getChallenges();
for (const error of errors) {
  console.error(error);
}
