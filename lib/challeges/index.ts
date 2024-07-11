import { glob } from "glob";

const getChallengePaths = async (repoRoot: string) => {
  return await glob("**/challenge.y?(a)ml", {
    cwd: repoRoot,
  });
};

export const getChallenges = async (repoRoot: string) => {
  const challenges = [];
  const errors = [];

  for (const path of await getChallengePaths(repoRoot)) {
    try {
      // validation issues should not block other challenges
      const challenge = await getChallenge(path);
      await validateChallenge(challenge);
      challenges.push(challenge);
    } catch (err) {
      errors.push(err);
    }
  }

  try {
    // challenge uniqueness issues should only block deploys, not builds
    validateChallenges(challenges);
  } catch (err) {
    errors.push(err);
  }
  return { challenges, errors };
};
