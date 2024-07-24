import { Loader } from "rcds/src/loader";
import { registry } from "rcds/src/registry";

import path from "path";
import fs from "fs/promises";
import { glob } from "glob";
import * as ts from "typescript";
import { compile } from "./compile";
// import { tsImport } from "tsx/esm/api";

interface TSFileLoaderConfig {
  repoRoot: string;
  model: Record<string, any>;
}

// @registry([{ token: "TSRawFileLoader", useValue: TSRawFileLoader }])
export class TSFileLoader extends Loader<TSFileLoaderConfig> {
  async getChallenges() {
    const challengeList = await glob("**/challenge.config.?(m)ts", {
      absolute: true,
      cwd: this.config.repoRoot,
    });

    console.log("challenge list", challengeList);

    const challengeFns = await Promise.all(
      challengeList.map(async (globPath) => {
        const file = await fs.readFile(globPath, "utf8");
        const sourceFile = await compile(globPath);
        console.log("source file", sourceFile);
      })
    );
  }
}
