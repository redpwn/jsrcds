// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import path from "path";
import fs from "fs";
import { Challenge } from "./challenge";

// TODO: please modularize
// export const hydrateChallenges = async (challenge: Challenge) => {
//   const dir = challenge.dir;
//   const segment = challenge.segment;
//   const configPath = challenge.configPath;

//   let flag;
//   if (config.flag.file) {
//     flag = (
//       await fs.promises.readFile(path.join(dir, config.flag.file), "utf8")
//     ).trim();
//   } else {
//     flag = config.flag;
//   }
//   const name = config.name ?? path.posix.basename(segment);
//   const newChallenge: any = {
//     configPath,
//     segment,
//     id: config.id ?? segment.toLowerCase().replaceAll("/", "-"),
//     author: config.author.join?.(", ") ?? config.author,
//     name,
//     category: config.category ?? path.posix.dirname(segment),
//     flag,
//     value:
//       typeof config.value === "number"
//         ? { min: config.value, max: config.value }
//         : config.value ?? rootConfig.scoreboard.rctf.defaultPoints,
//     visible: config.visible ?? true,
//     deployed: config.deployed ?? true,
//     tiebreakEligible: config.tiebreakEligible ?? true,
//     sortWeight: config.sortWeight ?? 0,
//     provide: [],
//     containers: [],
//     expose: {},
//   };
//   newChallenge.description = templateChallenge(challenge, config.description);
//   return newChallenge;
// };
