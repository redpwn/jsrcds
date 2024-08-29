export interface ContainerImage { }

export interface ContainerRegistry {
  pushImage(image: ContainerImage): void;
}