export interface ContainerDeployment {}

export interface Cluster {
  deployContainer(container: ContainerDeployment): void;
}
