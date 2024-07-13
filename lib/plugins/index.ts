export abstract class Plugin {
  abstract readonly key: string;

  abstract subscribeChannels: Record<string, any>;
  abstract publishChannels: string[];
}
