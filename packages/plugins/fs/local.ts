import { type FileStorage } from "./storage";

import path from "path";
import { glob } from "glob";
import { readFile } from "fs/promises";

export class LocalStorage implements FileStorage {
  constructor(private root: string) {}

  async glob(
    pattern: string,
    options: { absolute: true; cwd: string }
  ): Promise<string[]> {
    return glob(pattern, { ...options, cwd: this.root });
  }

  async readFile(filePath: string): Promise<string> {
    return readFile(path.join(this.root, filePath), "utf-8");
  }
}
