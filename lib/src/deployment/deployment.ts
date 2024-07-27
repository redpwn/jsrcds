import {
  LocalWorkspace,
  Stack,
  type PulumiFn,
} from "@pulumi/pulumi/automation";

interface DeploymentConfig {
  stackName?: string;
  projectName?: string;
  accessToken?: string;
  useLocalBackend?: boolean;
}

export class Deployment {
  constructor(private config: DeploymentConfig) {}

  async createStack(program: PulumiFn): Promise<Stack> {
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
          ...(this.config?.useLocalBackend && {
            backend: {
              url: `file://${process.cwd()}`,
            }, 
          }),
        },
        envVars: {
          PULUMI_CONFIG_PASSPHRASE: "",
          PULUMI_ACCESS_TOKEN: this.config.accessToken ?? "",
        },
      }
    );
  }
}
