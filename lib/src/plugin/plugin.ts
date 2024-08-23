export abstract class Plugin<T = unknown> {
  constructor(protected config: T) {}
}
