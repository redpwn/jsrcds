export abstract class FileStorage {
  abstract glob(
    pattern: string,
    options?: { absolute: boolean; cwd: string }
  ): Promise<string[]>;

  abstract readFile(path: string): Promise<string>;
}
