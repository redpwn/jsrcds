import { LocalWorkspace, Stack } from "@pulumi/pulumi/automation";

interface DeploymentConfig {
  stackName?: string;
  projectName?: string;
}

export class Deployment {
  constructor(private config: DeploymentConfig) {}

  // not fully sure if this is right approach
  async createStack(program: any): Promise<Stack> {
    return await LocalWorkspace.createOrSelectStack(
      {
        program,
        stackName: this.config?.stackName ?? "dev",
        projectName: this.config?.projectName ?? "rcds",
      },
      {
        projectSettings: {
          name: "rcds",
          runtime: "nodejs",
          // backend: {
          //   url: `file://${process.cwd()}`,
          // },
        },
        envVars: {
          PULUMI_CONFIG_PASSPHRASE: "",
          PULUMI_ACCESS_TOKEN: process.env.PULUMI_ACCESS_TOKEN,
        },
      }
    );
  }
}
