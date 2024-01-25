const vscode = require('vscode');
const iOSFeatures = require('../Platforms/iOSFeatures');
const commonFeatures = require('../Platforms/commonFeatures');

module.exports = {
    listProvisioningProfiles: listProvisioningProfiles,
    listSigningIdentities: listSigningIdentities, 
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

    await vscode.window.showQuickPick(provisioningProfiles.map(profile => profile.name), {
        placeHolder: 'Available provisioning profiles'
    });
}

/// <summary>
/// Lists the available signing identities.
/// </summary>
async function listSigningIdentities() {
    if (commonFeatures.isMacOS() === false) {
        vscode.window.showErrorMessage('This command only works on macOS.');
        return;
    }

    const signingIdentities = await iOSFeatures.getSigningIdentities();

    await vscode.window.showQuickPick(signingIdentities, {
        placeHolder: 'Available signing identities'
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

    const signingIdentities = await iOSFeatures.getSigningIdentities();

    const selectedSigningKey = await vscode.window.showQuickPick(signingIdentities,
    {
        placeHolder: 'Select a signing identity'
    });
    
    if (!selectedSigningKey) {
        return;
    }
    
    const provisioningProfiles = await iOSFeatures.getProvisioningProfiles();
    
    const selectedProvisioningProfile = await vscode.window.showQuickPick(provisioningProfiles.map(profile => profile.name), {
        placeHolder: 'Select a provisioning profile'
    });
    
    if (!selectedProvisioningProfile) {
        return;
    }

    let runtimeIdentifier = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('iOSRuntimeIdentifier');
    let iOSVersion = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('useExplicitiOSVersion');

    if(iOSVersion === null){
        iOSVersion = '';
    }

    // Removed output path for now -o "${outputPath}"
    const dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-ios${iOSVersion} -c ${commonFeatures.getBuildConfiguration()} -p:ArchiveOnBuild=true -p:RuntimeIdentifier=${runtimeIdentifier}  -p:CodesignKey="${selectedSigningKey}" -p:CodesignProvision="${selectedProvisioningProfile}"`;
    commonFeatures.executeCommandInTerminal(dotnetCommand);
}

