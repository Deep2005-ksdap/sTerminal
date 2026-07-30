import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";

let terminal: vscode.Terminal | undefined;
let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
let currentPid: number | undefined;

const TIMEOUT_MS = 10000;

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

      const runnerPath = path.join(context.extensionPath, "Engine", "main.exe");

      if (!terminal.shellIntegration) {
        await new Promise((r) => setTimeout(r, 300));
      }

      // Grab the PID of the shell so we can kill the process tree if needed
      currentPid = await terminal.processId;

      if (terminal.shellIntegration) {
        terminal.shellIntegration.executeCommand(
          `"${runnerPath}" "${filePath}"`,
        );
      } else {
        terminal.sendText(`"${runnerPath}" "${filePath}"`);
      }

      // Clear any leftover timer from a previous run before starting a new one
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      timeoutHandle = setTimeout(() => {
        if (currentPid) {
          exec(`taskkill /PID ${currentPid} /T /F`, (err) => {
            if (!err) {
              vscode.window.showWarningMessage(
                `sTerminal: Auto-stopped — exceeded ${TIMEOUT_MS / 1000}s (possible infinite loop)`,
              );
            }
          });
        }
      }, TIMEOUT_MS);
    },
  );

  const disposableStop = vscode.commands.registerCommand(
    "compilecpp.stopExecution",
    () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      if (currentPid) {
        exec(`taskkill /PID ${currentPid} /T /F`, (err) => {
          if (err) {
            vscode.window.showErrorMessage(`Could not stop: ${err.message}`);
          } else {
            vscode.window.showInformationMessage("Execution stopped.");
          }
        });
      } else {
        vscode.window.showInformationMessage("No running process to stop.");
      }
    },
  );

  // THIS is the fix — cancel the timeout the moment the command actually finishes
  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((e) => {
      if (e.terminal === terminal) {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = undefined;
        }
        console.log(`Command finished with exit code ${e.exitCode}`);
      }
    }),
  );

  context.subscriptions.push(disposableRun, disposableStop);
}

export function deactivate() {}