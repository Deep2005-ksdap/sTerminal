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
const child_process_1 = require("child_process");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    vscode.window.showInformationMessage("CompileCPP Activated!");
    console.log("CompileCPP Activated!");
    const disposableHello = vscode.commands.registerCommand("compilecpp.helloWorld", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }
        const filePath = editor.document.fileName;
        const runnerPath = "C:\\Users\\dk128\\OneDrive\\Desktop\\YOU 2.0\\WebDev\\Projects\\sTerminal\\main.exe";
        const child = (0, child_process_1.spawn)(runnerPath, [filePath]);
        child.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        child.stderr.on("data", (data) => {
            console.error(data.toString());
        });
        child.on("close", (code) => {
            console.log(`Runner exited with code ${code}`);
        });
    });
    const disposableCompile = vscode.commands.registerCommand("compilecpp.compileCurrentFile", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found!");
            return;
        }
        const filePath = editor.document.fileName;
        vscode.window.showInformationMessage(`CompileCPP command triggered for: ${filePath}`);
    });
    context.subscriptions.push(disposableHello, disposableCompile);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map