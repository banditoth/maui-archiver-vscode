const vscode = require('vscode');
const androidFeatures = require('../Platforms/androidFeatures');
const commonFeatures = require('../Platforms/commonFeatures');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');

module.exports = {
    publishAndroid: publishAndroid,
    listKeystores: listKeystores,
    generateCodeSigningKey: generateCodeSigningKey
};

/// <summary>
/// Publishes the selected csproj file for Android.
/// </summary>
async function publishAndroid() {
    let csprojPath = await commonFeatures.selectCsprojFile();

    let isSigningNeeded = (await vscode.window.showQuickPick(['Unsigned', 'Signed'], {
        placeHolder: 'Select the desired signing option'
    }) === 'Signed');

    let keystorePath, keyAlias, keyPassword, keyStoreName;

    if (isSigningNeeded) {
        keystorePath = await androidFeatures.showPickerForKeystore();

        if (!keystorePath) {
            return;
        }

        keyStoreName = path.basename(keystorePath, '.keystore');

        keyPassword = await vscode.window.showInputBox({
            prompt: 'Enter the password for the signing key',
            password: true
        });

        if (!keyPassword ) {
            return;
        }
        
        keyAlias = await androidFeatures.showPickerForAlias(keystorePath, keyPassword);

        if(keyAlias === null){
            keyAlias = keyStoreName;
        }
    }

    const packageFormat = await vscode.window.showQuickPick(['aab', 'apk'], {
        placeHolder: 'Select the desired package format'
    });

    if (!packageFormat) {
        return;
    }

    let androidVersion = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('useExplicitAndroidVersion');

    if(androidVersion === null){
        androidVersion = '';
    }

    let dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-android${androidVersion} -c ${commonFeatures.getBuildConfiguration()} -p:AndroidPackageFormat=${packageFormat}`;

    if (isSigningNeeded) {
        dotnetCommand += ` -p:AndroidKeyStore=true -p:AndroidSigningKeyStore="${keystorePath}" -p:AndroidSigningKeyAlias=${keyAlias} -p:AndroidSigningKeyPass=${keyPassword} -p:AndroidSigningStorePass=${keyPassword}`;
    }

    commonFeatures.executeCommandInTerminal(dotnetCommand);
}

/// <summary>
/// Selects a keystore file and checks its signature.
/// </summary>
async function listKeystores() {
    const selectedKeystore = await androidFeatures.showPickerForKeystore();

    if (selectedKeystore) {
        const keystoreFilePath = path.join(commonFeatures.getCurrentKeystoreFolder(), selectedKeystore);

        let keyPassword = await vscode.window.showInputBox({
            prompt: 'Enter the password for the signing key',
            password: true
        });

        if (!keyPassword) {
            return;
        }

        const keyToolFilePath = commonFeatures.getKeytoolPath();

        await exec(`"${keyToolFilePath}" -list -keystore "${keystoreFilePath}" -storepass "${keyPassword}"`, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage(`Error checking signature for ${keystoreFilePath}: ${stderr}`);
            } else {
                vscode.window.showInformationMessage(`Signature:\n${stdout}`);
            }
        });
    }
}

/// <summary>
/// Generates a code signing key.
/// </summary>
async function generateCodeSigningKey() {
    const keyName = await vscode.window.showInputBox({
        prompt: 'Enter a key name',
        placeHolder: 'e.g., mykey'
    });

    if (!keyName) {
        vscode.window.showWarningMessage('Key name is required.');
        return;
    }

    const keystorePassword = await androidFeatures.promptForKeystorePassword();
    if (!keystorePassword) {
        vscode.window.showWarningMessage('Keystore password is required.');
        return;
    }

    const keyPassword = await androidFeatures.promptForKeystorePassword();
    if (!keyPassword || keyPassword.length < 6) {
        vscode.window.showWarningMessage('Key password must be at least 6 characters.');
        return;
    }

    const keystoreDirectory = commonFeatures.getCurrentKeystoreFolder();
    const keystorePath = path.join(keystoreDirectory, `${keyName}.keystore`);

    const name = await vscode.window.showInputBox({
        prompt: 'Enter your name',
        placeHolder: 'e.g., John Doe'
    });

    const organizationalUnit = await vscode.window.showInputBox({
        prompt: 'Enter your organizational unit',
        placeHolder: 'e.g., Development Team'
    });

    const organization = await vscode.window.showInputBox({
        prompt: 'Enter your organization',
        placeHolder: 'e.g., My Company'
    });

    const city = await vscode.window.showInputBox({
        prompt: 'Enter your city',
        placeHolder: 'e.g., Anytown'
    });

    const state = await vscode.window.showInputBox({
        prompt: 'Enter your state',
        placeHolder: 'e.g., CA'
    });

    const country = await vscode.window.showInputBox({
        prompt: 'Enter your country code (2 characters)',
        placeHolder: 'e.g., US'
    });

    const keyToolFilePath = commonFeatures.getKeytoolPath();

    const command = `"${keyToolFilePath}" -genkeypair -v -keystore "${keystorePath}" -alias "${keyName}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "${keystorePassword}" -keypass "${keyPassword}" -dname "CN=${name}, OU=${organizationalUnit}, O=${organization}, L=${city}, ST=${state}, C=${country}"`;

    try {
        await androidFeatures.executeKeytoolCommand(command);
    }
    catch {
        // always runs to this point
    }
    try {
        await fs.access(keystorePath);
        vscode.window.showInformationMessage(`Key pair '${keyName}' generated successfully in '${keystoreDirectory}'.`);
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating key pair: Keystore file not found.`);
    }
}
