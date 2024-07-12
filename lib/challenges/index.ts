import { glob } from "glob";
import { Challenge } from "./challenge";

const getChallengePaths = async (repoRoot: string) => {
  return await glob("**/challenge.y?(a)ml", {
    cwd: repoRoot,
  });
};

export const getChallenges = async (repoRoot: string) => {
  const challenges = [];
  const errors = [];

  for (const globPath of await getChallengePaths(repoRoot)) {
    try {
      // validation issues should not block other challenges
      const challenge = new Challenge(repoRoot, globPath);
      challenge.readConfigFile();
      // await validateChallenge(challenge);
      challenges.push(challenge);
    } catch (err) {
      errors.push(err);
    }
  }

  try {
    // challenge uniqueness issues should only block deploys, not builds
    // validateChallenges(challenges);
  } catch (err) {
    errors.push(err);
  }
  return { challenges, errors };
};
