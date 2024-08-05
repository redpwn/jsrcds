export interface Cluster {
  createNamespace(name: string, labels: Record<string, string>): void;
}
