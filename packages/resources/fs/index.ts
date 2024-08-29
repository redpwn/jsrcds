export interface FileStorage {
  glob(
    pattern: string,
    options?: { absolute: boolean; cwd: string }
  ): Promise<string[]>;

  readFile(path: string): Promise<string>;
}
