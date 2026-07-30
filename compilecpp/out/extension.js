"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let terminal;
let timeoutHandle;
let currentPid;
const TIMEOUT_MS = 10000;
function activate(context) {
    const disposableRun = vscode.commands.registerCommand("compilecpp.runCurrentFile", async () => {
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
            terminal.shellIntegration.executeCommand(`"${runnerPath}" "${filePath}"`);
        }
        else {
            terminal.sendText(`"${runnerPath}" "${filePath}"`);
        }
        // Clear any leftover timer from a previous run before starting a new one
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout(() => {
            if (currentPid) {
                (0, child_process_1.exec)(`taskkill /PID ${currentPid} /T /F`, (err) => {
                    if (!err) {
                        vscode.window.showWarningMessage(`sTerminal: Auto-stopped — exceeded ${TIMEOUT_MS / 1000}s (possible infinite loop)`);
                    }
                });
            }
        }, TIMEOUT_MS);
    });
    const disposableStop = vscode.commands.registerCommand("compilecpp.stopExecution", () => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        if (currentPid) {
            (0, child_process_1.exec)(`taskkill /PID ${currentPid} /T /F`, (err) => {
                if (err) {
                    vscode.window.showErrorMessage(`Could not stop: ${err.message}`);
                }
                else {
                    vscode.window.showInformationMessage("Execution stopped.");
                }
            });
        }
        else {
            vscode.window.showInformationMessage("No running process to stop.");
        }
    });
    // THIS is the fix — cancel the timeout the moment the command actually finishes
    context.subscriptions.push(vscode.window.onDidEndTerminalShellExecution((e) => {
        if (e.terminal === terminal) {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = undefined;
            }
            console.log(`Command finished with exit code ${e.exitCode}`);
        }
    }));
    context.subscriptions.push(disposableRun, disposableStop);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map