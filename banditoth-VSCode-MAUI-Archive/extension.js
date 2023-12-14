const vscode = require('vscode');
const iOSCommands = require('./Commands/iOSCommands');
const androidCommands = require('./Commands/androidCommands');

function activate(context) {
  // iOS Commands
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.listProvisioningProfiles', iOSCommands.listProvisioningProfiles));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishiOS', iOSCommands.publishiOS));
  // Android Commands
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.listKeystores', androidCommands.listKeystores));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.generateCodeSigningKey', androidCommands.generateCodeSigningKey));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishAndroid', androidCommands.publishAndroid));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:banditoth.VSCode-MAUI-Archive');
  }));

  console.log('Extension activated.');
}

module.exports = {
  activate
};
