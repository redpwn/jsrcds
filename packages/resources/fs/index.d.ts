export interface FileStorage {
  glob(
    pattern: string,
    options?: { absolute: true; cwd: string }
  ): Promise<string[]>;

  readFile(path: string): Promise<string>;
}
