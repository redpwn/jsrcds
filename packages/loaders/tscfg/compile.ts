import * as ts from "typescript";

export async function compile(fileName: string): Promise<string> {
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.NodeNext,
    target: ts.ScriptTarget.ESNext,
  };

  const host = ts.createCompilerHost(options);
  const program = ts.createProgram([fileName], options, host);

  let compiledCode = "";

  const emitResult = program.emit(undefined, (fileName, data) => {
    if (fileName.endsWith(".js")) {
      compiledCode = data;
    }
  });

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.error(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.error(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  if (emitResult.emitSkipped) {
    throw new Error("TypeScript compilation failed");
  }

  return compiledCode;
}
