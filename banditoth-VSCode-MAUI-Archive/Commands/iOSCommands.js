const vscode = require('vscode');
const iOSFeatures = require('../Platforms/iOSFeatures');
const commonFeatures = require('../Platforms/commonFeatures');

module.exports = {
    listProvisioningProfiles: listProvisioningProfiles,
    publishiOS: publishiOS
};

/// <summary>
/// Lists the available provisioning profiles.
/// </summary>
async function listProvisioningProfiles() {
    if (commonFeatures.isMacOS() === false) {
        vscode.window.showErrorMessage('This command only works on macOS.');
        return;
    }

    const provisioningProfiles = await iOSFeatures.getProvisioningProfiles();

    await vscode.window.showQuickPick(provisioningProfiles, {
        placeHolder: 'Available provisioning profiles'
    });
}

/// <summary>
/// Publishes the selected csproj file for iOS.
/// </summary>
async function publishiOS() {
    if (commonFeatures.isMacOS() === false) {
        vscode.window.showErrorMessage('This command only works on macOS.');
        return;
    }

    let csprojPath = await commonFeatures.selectCsprojFile();

    if(!csprojPath) {
        return;
    }

    const provisioningProfiles = await iOSFeatures.getProvisioningProfiles();
    const selectedProvisioningProfile = await vscode.window.showQuickPick(provisioningProfiles, {
        placeHolder: 'Select a provisioning profile'
    });

    if (!selectedProvisioningProfile) {
        return;
    }

    const signingKeys = await iOSFeatures.getKeysByProvisioningProfile(selectedProvisioningProfile);

    const selectedSigningKey = await vscode.window.showQuickPick(signingKeys, {
        placeHolder: 'Select a signing key'
    });

    if (!selectedSigningKey) {
        return;
    }

    // Removed output path for now -o "${outputPath}"
    const dotnetCommand = `dotnet publish "${csprojPath}" -f net8.0-ios -c Release -p:ArchiveOnBuild=true -p:RuntimeIdentifier=ios-arm64  -p:CodesignKey="${selectedSigningKey}" -p:CodesignProvision="${selectedProvisioningProfile}"`;
    commonFeatures.executeCommandInTerminal(dotnetCommand);
}

