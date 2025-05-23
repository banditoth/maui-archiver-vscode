const vscode = require('vscode');
const appleFeatures = require('../Platforms/appleFeatures');
const commonFeatures = require('../Platforms/commonFeatures');

module.exports = {
    listProvisioningProfiles: listProvisioningProfiles,
    listSigningIdentities: listSigningIdentities,
    publishiOS: publishiOS,
    publishmacCatalyst: publishmacCatalyst
};

/// <summary>
/// Lists the available provisioning profiles.
/// </summary>
async function listProvisioningProfiles() {
    if (commonFeatures.isMacOS() === false) {
        vscode.window.showErrorMessage('This command only works on macOS.');
        return;
    }

    const provisioningProfiles = await appleFeatures.getProvisioningProfiles();

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

    const signingIdentities = await appleFeatures.getSigningIdentities();

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

    if (!csprojPath) {
        return;
    }

    const signingIdentities = await appleFeatures.getSigningIdentities();

    let selectedSigningKey = await vscode.window.showQuickPick(signingIdentities,
        {
            placeHolder: 'Select a signing identity'
        });

    if (!selectedSigningKey) {
        return;
    }

    // Replace comma with %2C if it exists in the selectedSigningKey
    if (selectedSigningKey.includes(',')) {
        selectedSigningKey = selectedSigningKey.replace(/,/g, '%2C');
    }

    const provisioningProfiles = await appleFeatures.getProvisioningProfiles();

    const selectedProvisioningProfile = await vscode.window.showQuickPick(provisioningProfiles.map(profile => profile.name), {
        placeHolder: 'Select a provisioning profile'
    });

    if (!selectedProvisioningProfile) {
        return;
    }

    let runtimeIdentifier = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('iOSRuntimeIdentifier');
    let iOSVersion = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('useExplicitiOSVersion');

    if (iOSVersion === null) {
        iOSVersion = '';
    }

    // Removed output path for now -o "${outputPath}"
    const dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-ios${iOSVersion} -c ${commonFeatures.getBuildConfiguration()} -p:ArchiveOnBuild=true -p:RuntimeIdentifier=${runtimeIdentifier}  -p:CodesignKey="${selectedSigningKey}" -p:CodesignProvision="${selectedProvisioningProfile}"`;
    commonFeatures.executeCommandInTerminal(dotnetCommand);
}


/// <summary>
/// Publishes the selected csproj file for MacCatalyst.
/// </summary>
async function publishmacCatalyst() {
    if (commonFeatures.isMacOS() === false) {
        vscode.window.showErrorMessage('This command only works on macOS.');
        return;
    }

    let csprojPath = await commonFeatures.selectCsprojFile();

    if (!csprojPath) {
        return;
    }

    let dotnetCommand;

    let isSigningNeeded = (await vscode.window.showQuickPick(['Unsigned', 'Signed'], {
        placeHolder: 'Select the desired signing option'
    }) === 'Signed');

    if(!isSigningNeeded) {
        let createPackage = (await vscode.window.showQuickPick(['.app', '.pkg'], {
            placeHolder: 'Select output format'
        }) === '.pkg');

        dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-maccatalyst -c ${commonFeatures.getBuildConfiguration()} -p:CreatePackage=${createPackage}`;
        commonFeatures.executeCommandInTerminal(dotnetCommand);
        return;
    }

    const distributionMode = await vscode.window.showQuickPick(['AppStore', 'Outside of the AppStore'], {
        placeHolder: 'Select the app\'s distribution mode'
    });

    let useHardenedRuntime = false;
    if (!distributionMode) {
        return;
    }
    else {
        if (distributionMode === 'Outside of the AppStore')
            useHardenedRuntime = true;
    }

    const signingIdentities = await appleFeatures.getSigningIdentities();

    let selectedSigningKey = await vscode.window.showQuickPick(signingIdentities,
        {
            placeHolder: 'Select a signing identity'
        });

    if (!selectedSigningKey) {
        return;
    }

    // Replace comma with %2C if it exists in the selectedSigningKey
    if (selectedSigningKey.includes(',')) {
        selectedSigningKey = selectedSigningKey.replace(/,/g, '%2C');
    }

    const provisioningProfiles = await appleFeatures.getProvisioningProfiles();

    const selectedProvisioningProfile = await vscode.window.showQuickPick(provisioningProfiles.map(profile => profile.name), {
        placeHolder: 'Select a provisioning profile'
    });

    if (!selectedProvisioningProfile) {
        return;
    }

    dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-maccatalyst -c ${commonFeatures.getBuildConfiguration()} -p:ArchiveOnBuild=true -p:UseHardenedRuntime=${useHardenedRuntime} -p:CodesignKey="${selectedSigningKey}" -p:CodesignProvision="${selectedProvisioningProfile}"`;

    commonFeatures.executeCommandInTerminal(dotnetCommand);
}

