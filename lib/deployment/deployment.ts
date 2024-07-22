import { LocalWorkspace, Stack } from "@pulumi/pulumi/automation";

export class Deployment {
  constructor() {}

  // not fully sure if this is right approach
  static async createStack(program: any, config?: any): Promise<Stack> {
    return await LocalWorkspace.createOrSelectStack(
      {
        program,
        stackName: config?.stackName ?? "dev",
        projectName: config?.projectName ?? "rcds"
      },
      {
        projectSettings: {
          name: "rcds",
          runtime: "nodejs",
          backend: {
            url: `file://${process.cwd()}`,
          },
        },
        envVars: {
          PULUMI_CONFIG_PASSPHRASE: "",
        },
      }
    );
  }
}