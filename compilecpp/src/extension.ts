import * as vscode from "vscode";
import * as path from "path";

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
  const disposableRun = vscode.commands.registerCommand(
    "compilecpp.runCurrentFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found!");
        return;
      }

      if (editor.document.isDirty) {
        await editor.document.save();
      }

      const filePath = editor.document.fileName;

      if (!terminal || terminal.exitStatus !== undefined) {
        terminal = vscode.window.createTerminal("sTerminal");
      }
      terminal.show();

      const runnerPath = path.join(context.extensionPath, "..","main.exe");

      // Wait a tick for shellIntegration to attach on a freshly created terminal
      if (!terminal.shellIntegration) {
        await new Promise((r) => setTimeout(r, 300));
      }

      if (terminal.shellIntegration) {
        terminal.shellIntegration.executeCommand(
          `"${runnerPath}" "${filePath}"`,
        );
      } else {
        terminal.sendText(`"${runnerPath}" "${filePath}"`);
      }
    },
  );

  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((e) => {
      console.log(`Command finished with exit code ${e.exitCode}`);
    }),
  );

  context.subscriptions.push(disposableRun);
}

export function deactivate() {}