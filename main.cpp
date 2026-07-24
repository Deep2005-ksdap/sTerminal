#include <iostream>
#include <fstream>
#include<string>

using namespace std;

// fname == filepath in whole code

class FileValidator{
    public:
    bool fileExists(const string& fname){
        ifstream file(fname);
        return file.is_open();
    }
};

class Compiler{
    public:
    bool compile(const string& fname){
        string command = "g++ \"" + fname + "\" -o temp.exe";

        return system(command.c_str()) == 0;
    }
};

class Executer{
    public:
    bool run(const string& Exe){
        return system(Exe.c_str()) == 0;
    }
};

int main(int argc, char** argv){
    if(argc < 2){
        cerr << "Usage: " << argv[0] << " <file_path>\n";
        return 1;
    }

    string filepath = argv[1];
    string outputExe = "temp.exe";

    FileValidator fvdr;
    if(!fvdr.fileExists(filepath)){
        cerr << "Error: file path doesn't exist..." << filepath << "\n";
        return 1;
    }

    Compiler compiler;
    if(!compiler.compile(filepath)){
        cerr << "Compilation Failed!\n";
        return 1;
    }
    cout << "Compilation Successful!\n";

    Executer executer;
    std::cout << "--- Program Output ---\n";
    if (!executer.run(outputExe)) {
        std::cerr << "Execution Failed!\n";
        return 1;
    }


    return 0;
}