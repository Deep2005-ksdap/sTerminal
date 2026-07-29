# CompileCPP

A lightweight VS Code extension built for my personal DSA workflow.

CompileCPP allows me to compile and run the currently opened C++ file with a single key press, eliminating the need to repeatedly open a terminal and type compilation commands.

---

## Features

- 🚀 Run the currently opened C++ file using **F5**
- 📄 Automatically detects the active `.cpp` file
- ⚙️ Compiles using the C++ engine (`main.exe`)
- ▶️ Executes the compiled program automatically
- ⏱️ Displays compilation time
- ⏱️ Displays execution time
- 🧹 Cleans previously generated executable before compilation
- ❌ Shows compilation errors
- 💥 Shows runtime errors (if any)
- 📂 Validates file path before execution

---

## Workflow

```
Press F5
      │
      ▼
Detect current .cpp file
      │
      ▼
Compile
      │
      ▼
Run
      │
      ▼
Display output
```

---

## Requirements

- Windows
- GCC / G++ installed and added to PATH
- VS Code

---

## Current Status

Implemented:

- Active file detection
- Engine integration
- Automatic compile & run
- Compilation timer
- Execution timer
- Error handling
- F5 shortcut support

---

## Roadmap

Planned improvements:

- Better output formatting
- Integrated VS Code Terminal output
- Input file support
- Execution timeout
- Automatic cleanup
- Configurable compiler flags

---

## Known Issues

- Output order may appear inconsistent because the engine currently uses `system()` to execute the compiled program. This will be improved in a future version by replacing it with a dedicated process API.
- Currently supports Windows only.

---

## Why I Built This

While practicing DSA, I found myself repeatedly typing commands like:

```bash
g++ file.cpp -o file.exe && ./file.exe
```

This extension removes that repetitive step and lets me focus on solving problems instead of managing the terminal.

