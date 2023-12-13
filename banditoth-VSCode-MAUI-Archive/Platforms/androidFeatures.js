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
}

/// <summary>
/// Returns the available keystore files in the specified folder.
/// </summary>
async function getKeystoresFromFolder(keystoreListPath) {
    return new Promise((resolve, reject) => {
        vscode.workspace.fs.readDirectory(vscode.Uri.file(keystoreListPath)).then(
            files => {
                const keystoreFiles = files
                    .filter(file => file[1] === vscode.FileType.File && file[0].endsWith('.keystore'))
                    .map(file => file[0]);
                resolve(keystoreFiles);
            },
            error => {
                reject(error);
            }
        );
    });
}

/// <summary>
/// Returns the available key aliases in the specified keystore.
/// </summary>
async function getKeystoreAliases(keystorePath, keystorePassword) {
    try {
        const keystoreInfo = await invokeKeytoolWithResult(`keytool -list -keystore "${keystorePath}" -storepass "${keystorePassword}"`);
        const aliasMatches = keystoreInfo.match(/Alias name: (.+)/g);

        if (!aliasMatches) {
            vscode.window.showWarningMessage('No aliases found in the keystore.');
            return [];
        }

        const aliases = aliasMatches.map(match => match.split(':')[1].trim());
        return aliases;
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

    const selectedAlias = await vscode.window.showQuickPick(keystoreAliases, {
        placeHolder: 'Select a key alias'
    });

    return selectedAlias;
}



/// <summary>
/// Invokes the keytool command with the specified arguments in the background and returns the result of the invocation.
/// </summary>
async function invokeKeytoolWithResult(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
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

    return selectedKeystore ? path.join(androidKeystoreListPath, selectedKeystore) : null;
}