# sTerminal (CompileCPP)

A lightweight VS Code extension to compile and run C++ files directly from the editor — built for daily DSA practice and learning.

## Features

- ✅ Auto-detects the currently open `.cpp` file
- ✅ Auto-saves before compiling (no more running stale code)
- ✅ Compiles using `g++` and reports compile time
- ✅ Runs the compiled executable and reports execution time
- ✅ Output shown directly in the integrated terminal (supports interactive input via `cin`)
- ✅ Uses VS Code Shell Integration to detect exactly when a run finishes
- ✅ Auto-stops execution if a program runs too long (infinite loop protection) — only triggers if the program is genuinely still running, not on normal completion
- ✅ Manual stop shortcut for running processes
- ✅ Keyboard shortcuts: `F5` to run, `Shift+F5` to stop
- ✅ Runner path resolved relative to the extension's own install folder (no hardcoded machine-specific paths)

## Requirements

- [g++](https://www.mingw-w64.org/) installed and available on your system PATH
- Windows (current version relies on `taskkill` for process termination)
- VS Code with Shell Integration enabled (enabled by default in recent versions)

## Usage

1. Open any `.cpp` file
2. Press `F5` to compile and run
3. Program output (and input prompts, if any) appear in the **sTerminal** terminal tab
4. Press `Shift+F5` at any time to force-stop a running program
5. If a program runs longer than 10 seconds, it is automatically stopped and a warning notification appears (likely infinite loop)

## How it works

- Launches the run command via `terminal.shellIntegration.executeCommand(...)` (falls back to `sendText` if shell integration isn't available)
- Tracks the shell's process ID (`terminal.processId`) so it can forcefully terminate the entire process tree (`taskkill /PID <pid> /T /F`) if needed
- Listens for `onDidEndTerminalShellExecution` to detect real command completion and cancel the auto-stop timer accordingly

## Known Limitations

- Currently Windows-only (process killing uses `taskkill`)
- No configurable compiler flags yet (uses default `g++` settings)
- Timeout is currently fixed at 10 seconds (not user-configurable via settings)
- No support for multi-file projects yet — single `.cpp` file only
- No clickable/auto-parsed compile errors yet (errors show as raw terminal text)

## Roadmap

- [ ] Configurable timeout duration
- [ ] Configurable compiler path/flags
- [ ] Multi-file project support
- [ ] Clickable compile errors (jump to line/column)
- [ ] Cross-platform support (Mac/Linux)

## License

Personal project — built for daily C++/DSA practice.