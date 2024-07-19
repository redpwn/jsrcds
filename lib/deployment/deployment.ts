import { LocalWorkspace, Stack } from "@pulumi/pulumi/automation";

export class Deployment {
  constructor() {}

  static async createStack(program: any): Promise<Stack> {
    return await LocalWorkspace.createOrSelectStack(
      {
        program,
        stackName: "dev",
        projectName: "rcds",
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
