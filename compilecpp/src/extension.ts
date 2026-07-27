import * as vscode from "vscode";
import { spawn } from "child_process";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("CompileCPP Activated!");

  console.log("CompileCPP Activated!");

  const disposableHello = vscode.commands.registerCommand(
    "compilecpp.helloWorld",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      const filePath = editor.document.fileName;

      const runnerPath =
        "C:\\Users\\dk128\\OneDrive\\Desktop\\YOU 2.0\\WebDev\\Projects\\sTerminal\\main.exe";

      const child = spawn(runnerPath, [filePath]);
      child.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      child.stderr.on("data", (data) => {
        console.error(data.toString());
      });
      child.on("close", (code) => {
        console.log(`Runner exited with code ${code}`);
      });
    },
  );

  const disposableCompile = vscode.commands.registerCommand(
    "compilecpp.compileCurrentFile",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      const filePath = editor.document.fileName;

      vscode.window.showInformationMessage(
        `CompileCPP command triggered for: ${filePath}`,
      );
    },
  );

  context.subscriptions.push(disposableHello, disposableCompile);
}

// This method is called when your extension is deactivated
export function deactivate() {}
