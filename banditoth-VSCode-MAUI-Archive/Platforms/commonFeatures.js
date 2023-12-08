const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

module.exports = {
    executeCommandInTerminal: executeCommandInTerminal,
    isMacOS: isMacOS,
    isLinux: isLinux,
    isWindows: isWindows,
    getRuntimePlatform: getRuntimePlatform,
    getDefaultXamarinFolder: getDefaultXamarinFolder,
    selectCsprojFile: selectProjectOrSolution
};

/// <summary>
/// Executes the passed command in a new terminal window.
/// </summary>
function executeCommandInTerminal(command) {
    const terminal = vscode.window.createTerminal('NET MAUI - Archive / Publish tool');
    terminal.sendText(command);
    terminal.show();
}

/// <summary>
/// Returns whether the current platform is macOS.
/// </summary>
function isMacOS() {
    return getRuntimePlatform() === 'macOS';
}

/// <summary>
/// Returns whether the current platform is Windows.
/// </summary>
function isWindows() {
    return getRuntimePlatform() === 'Windows';
}

/// <summary>
/// Returns whether the current platform is Linux.
/// </summary>
function isLinux() {
    return getRuntimePlatform() === 'Linux';
}

/// <summary>
/// Returns the current platform.
/// </summary>
/// <returns>macOS, Windows, Linux</returns>
function getRuntimePlatform() {
    switch (process.platform) {
        case 'darwin':
            return 'macOS';
        case 'win32':
            return 'Windows';
        case 'linux':
            return 'Linux';
        default:
            throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

/// <summary>
/// Returns the path to the default Xamarin folder.
/// </summary>
function getDefaultXamarinFolder() {
    if (isWindows()) {
        return 'C:\\ProgramData\\Xamarin\\Mono for Android\\';
    } else if (isMacOS()) {
        return path.join(require('os').homedir(), '.local/share/Xamarin/Mono for Android/');
    } else {
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
}

/// <summary>
/// Displays a selection dialog with the available csproj files.
/// </summary>
/// <returns>The path to the selected csproj file.</returns>
async function selectProjectOrSolution() {
   const workspacePath = vscode.workspace.rootPath;

    if (!workspacePath) {
        vscode.window.showErrorMessage('No workspace opened.');
        return;
    }

    const solutionOrProjectFiles = [];

    function findSolutionOrProjectFiles(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            if (fs.statSync(filePath).isDirectory()) {
                findSolutionOrProjectFiles(filePath);
            } else if (file.endsWith('.csproj') || file.endsWith('.sln')) {
                solutionOrProjectFiles.push(path.relative(workspacePath, filePath));
            }
        });
    }

    findSolutionOrProjectFiles(workspacePath);

    if (solutionOrProjectFiles.length === 0) {
        vscode.window.showErrorMessage('No .csproj or .sln files in the current workspace');
        return;
    }

    const quickPickItems = solutionOrProjectFiles.map(file => ({
        label: file
    }));

    let selectedPath;

    await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select a .csproj or .sln file'
    }).then(selectedItem => {
        if (selectedItem) {
            selectedPath = path.join(workspacePath, selectedItem.label);
        }
    });

    return selectedPath;
}
