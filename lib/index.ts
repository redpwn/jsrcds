import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";

class RcdsStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

const app = new App({
  outdir: "build",
  hclOutput: true,
});

new RcdsStack(app, "rcds");

app.synth();
