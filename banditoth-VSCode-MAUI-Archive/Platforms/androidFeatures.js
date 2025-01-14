const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const commonFeatures = require('./commonFeatures');

module.exports = {
    getKeystoresFromFolder: getKeystoresFromFolder,
    showPickerForKeystore: showPickerForKeystore,
    showPickerForAlias: showPickerForAlias,
    promptForKeystorePassword: promptForKeystorePassword,
    invokeKeytoolWithResult: invokeKeytoolWithResult
}

/// <summary>
/// Returns the available keystore files in the specified folder and its subfolders.
/// </summary>
function getKeystoresFromFolder(keystoreListPath) {
    return new Promise((resolve, reject) => {
        const keystoreFiles = [];

        async function processFolder(folderUri) {
            try {
                const files = await vscode.workspace.fs.readDirectory(folderUri);

                for (const [name, type] of files) {
                    const filePath = path.join(folderUri.fsPath, name);

                    if (type === vscode.FileType.File && name.endsWith('.keystore')) {
                        keystoreFiles.push(filePath);
                    } else if (type === vscode.FileType.Directory) {
                        await processFolder(vscode.Uri.file(filePath));
                    }
                }
            } catch (error) {
                console.error('Error reading directory:', error);
                reject(error);
            }
        }

        processFolder(vscode.Uri.file(keystoreListPath)).then(() => {
            resolve(keystoreFiles);
        });
    });
}

/// <summary>
/// Returns the available key aliases in the specified keystore.
/// </summary>
async function getKeystoreAliases(keystorePath, keystorePassword) {
    try {
        const keystoreInfo = await invokeKeytoolWithResult(`-list -keystore "${keystorePath}" -storepass "${keystorePassword}"`);

        let jdkVersion = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('androidJDKVersion');
        if (jdkVersion === 'jdk17-') {
            const aliasMatches = keystoreInfo.match(/Alias name: (.+)/g);

            if (!aliasMatches) {
                vscode.window.showWarningMessage('No aliases found in the keystore.');
                return [];
            }

            const aliases = aliasMatches.map(match => match.split(':')[1].trim());
            return aliases;
        }
        else if (jdkVersion == 'jdk17+') {
            const entryLines = keystoreInfo
                .split('\n')
                .filter(line => line.match(/, PrivateKeyEntry/));

            if (entryLines.length === 0) {
                vscode.window.showWarningMessage('No aliases found in the keystore.');
                return [];
            }

            const aliases = entryLines.map(line => line.split(',')[0].trim());
            return aliases;
        }
        else
            throw "UNKNOWN JDK VERSION SET IN SETTINGS"
    } catch (error) {
        vscode.window.showErrorMessage(`Error getting keystore aliases: ${error.message}`);
        return [];
    }
}

/// <summary>
/// Prompts the user for the keystore password.
/// </summary>
async function promptForKeystorePassword() {
    return await vscode.window.showInputBox({
        prompt: 'Enter key password (at least 6 characters)',
        password: true,
        validateInput: input => (input.length >= 6 ? null : 'Key password must be at least 6 characters.')
    });
}

/// <summary>
/// Shows a selection dialog with the available key aliases.
/// </summary>
async function showPickerForAlias(keystorePath, keyPassword) {
    const keystoreAliases = await getKeystoreAliases(keystorePath, keyPassword);

    if (keystoreAliases.length === 0) {
        return null;
    }

    if (keystoreAliases.length === 1) {
        return keystoreAliases[0];
    }

    const selectedAlias = await vscode.window.showQuickPick(keystoreAliases, {
        placeHolder: 'Select a key alias'
    });

    return selectedAlias;
}



/// <summary>
/// Invokes the keytool command with the specified arguments in the background and returns the result of the invocation.
/// </summary>
async function invokeKeytoolWithResult(parameters) {
    return new Promise((resolve, reject) => {
        const keyToolFilePath = commonFeatures.getKeytoolPath();
        exec(`${keyToolFilePath} ${parameters}`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Error executing keytool command: ${error.message}`));
                return;
            }
            if (stderr) {
                reject(new Error(`keytool command stderr: ${stderr}`));
                return;
            }

            resolve(stdout);
        });
    });
}

/// <summary>
/// Displays a selection dialog with the available keystore files.
/// </summary>
async function showPickerForKeystore() {
    let androidKeystoreListPath = commonFeatures.getCurrentKeystoreFolder();

    const keystoreFiles = await getKeystoresFromFolder(androidKeystoreListPath);

    const selectedKeystore = await vscode.window.showQuickPick(keystoreFiles, {
        placeHolder: 'Select a keystore'
    });

    return selectedKeystore;
}