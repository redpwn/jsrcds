// we validate challenges in three ways:
// 1. validateChallengeConfig checks config against json schema
// 2. validateChallenge checks dependencies for individual challenges (dockerfiles exist, flag is correct format, etc)
// 3. validateChallenges checks that all challenges are unique (no duplicate ids, ports, etc)

// import { challengeConfigSchema, type ChallengeConfig } from "../schemas";

// const validateChallengeConfig = (config: ChallengeConfig) => {
//   const { data, error, success } = challengeConfigSchema.safeParse(config);
//   if (!success) {
//   }
// };

// const validateChallenge = async (challenge) => {
//   // if (!/^[a-z0-9](?:[a-z0-9-]{0,48}[a-z0-9])?$/.test(challenge.id)) {
//   //   throw new Error(`invalid id: ${challenge.segment}: ${challenge.id}`);
//   // }
//   if (!flagRegex.test(challenge.flag)) {
//     throw new Error(`invalid flag: ${challenge.segment}: ${challenge.flag}`);
//   }
//   // provides are alredy implicitly checked by hashFile
// };

// const validateChallenges = (challenges) => {
//   const ids = new Set();
//   for (const challenge of challenges) {
//     if (ids.has(challenge.id)) {
//       throw new Error(`duplicate id: ${challenge.segment}: ${challenge.id}`);
//     }
//     ids.add(challenge.id);
//   }
// };
