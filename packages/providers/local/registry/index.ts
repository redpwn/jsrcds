import { ContainerRegistry, ContainerImage } from "@rcds/resource-registry";

export class LocalRegistry implements ContainerRegistry {
  pushImage(image: ContainerImage): void {
    // todo: figure out pulumi methods for pushing to docker desktop/orbstack registry

  }

}
