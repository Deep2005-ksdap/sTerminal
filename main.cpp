#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <cstdio>
#include<chrono> 

using namespace std;
using namespace std::chrono;
namespace fs = filesystem;

class FileValidator {
public:
    bool fileExists(const string& fname) {
        ifstream file(fname);
        return file.is_open();
    }

    bool isCppFile(const string& fname) {
        fs::path p(fname);
        return p.extension() == ".cpp";
    }
};

class Compiler : private FileValidator {
    double compileTime = 0;
public:
    bool compile(const string& fname, const string& outputExe) {
        if (fileExists(outputExe)) {
            if (remove(outputExe.c_str()) == 0) {
                cout << "Cleaned up old executable: " << outputExe << "\n";
            } else {
                cerr << "Warning: Could not delete old executable.\n";
            }
        }

        if(!isCppFile(fname)) return false;

        string command = "g++ \"" + fname + "\" -o \"" + outputExe + "\"";

        auto compileStart = high_resolution_clock::now();
        int compileResult = system(command.c_str());
        auto compileEnd = high_resolution_clock::now();

        compileTime = duration_cast<milliseconds>(compileEnd - compileStart).count();
        return compileResult == 0;
    }

    int getCompilationTime(){
        return compileTime;
    }
};

class Executer {
    double runTime = 0;
public:
    bool run(const string& outputExe) {
        auto runStart = high_resolution_clock::now();
        int runResult = system(outputExe.c_str());
        auto runEnd = high_resolution_clock::now();

        runTime = duration_cast<milliseconds>(runEnd - runStart).count();
        return runResult == 0;
    }

    int getRunTime(){
        return runTime;
    }
};

int main(int argc, char** argv) {
    if (argc < 2) {
        cerr << "Usage: " << argv[0] << " <file_path>\n";
        return 1;
    }

    string filepath = argv[1];
    string outputExe = "temp.exe";

    FileValidator fvdr;
    if (!fvdr.fileExists(filepath)) {
        cerr << "Error: file path doesn't exist... " << filepath << "\n";
        return 1;
    }

    Compiler compiler;
    if (!compiler.compile(filepath, outputExe)) {
        cerr << "Compilation Failed!\n";
        return 1;
    }
    cout << "Compilation Successful!\n";

    Executer executer;

    cout << "Compilation Time: " <<compiler.getCompilationTime() << "ms\t";
    cout << "|\t";
    cout << "Execution Time: " <<executer.getRunTime() << "ms\n";

    cout << "--- Program Output ---\n";
    if (!executer.run(outputExe)) {
        cerr << "Execution Failed!\n";
        return 1;
    }

    return 0;
}