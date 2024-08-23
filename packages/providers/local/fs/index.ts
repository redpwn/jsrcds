import { type FileStorage } from "@rcds/resource-fs";

import path from "path";
import { glob } from "glob";
import { readFile } from "fs/promises";

export class LocalStorage implements FileStorage {
  constructor(public root: string) {}

  async glob(
    pattern: string,
    options: { absolute: boolean; cwd: string }
  ): Promise<string[]> {
    return glob(pattern, { ...options, cwd: this.root });
  }

  async readFile(filePath: string): Promise<string> {
    return readFile(path.join(this.root, filePath), "utf-8");
  }
}
