const vscode = require('vscode');
const androidFeatures = require('../Platforms/androidFeatures');
const commonFeatures = require('../Platforms/commonFeatures');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');

module.exports = {
    publishWindows: publishWindows,
};

/// <summary>
/// Publishes the selected csproj file for Windows.
/// </summary>
async function publishWindows() {
    if (commonFeatures.isWindows() === false) {
        vscode.window.showErrorMessage('This command only works on Windows.');
        return;
    }

    let csprojPath = await commonFeatures.selectCsprojFile();

    if(!csprojPath) {
        return;
    }
    
    const selectedPackageType = await vscode.window.showQuickPick(["Packaged", "Unpackaged"],
    { 
        placeHolder: 'Select packaging format' 
    });
    
    if (!selectedPackageType) {
        return;
    }

    const selectedRuntime = await vscode.window.showQuickPick(["win10-x64", "win10-x86"],
    { 
        placeHolder: 'Select a runtime identifier' 
    });
    
    if (!selectedRuntime) {
        return;
    }

    let windowsVersionNo = vscode.workspace.getConfiguration('VSCode-MAUI-Archive').get('useExplicitWindowsVersion');

    if(windowsVersionNo === null){
        windowsVersionNo = '';
    }

    let dotnetCommand = `dotnet publish "${csprojPath}" -f ${commonFeatures.getDotnetVersion()}-${windowsVersionNo} -c ${commonFeatures.getBuildConfiguration()} -p:RuntimeIdentifierOverride=${selectedRuntime}`;

    if(selectedPackageType === "Unpackaged") {
        dotnetCommand += ` -p:WindowsPackageType=None`;
    }
    commonFeatures.executeCommandInTerminal(dotnetCommand);
}