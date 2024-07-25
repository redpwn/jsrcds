export abstract class Plugin<T> {
  constructor(protected config: T) {}
}
