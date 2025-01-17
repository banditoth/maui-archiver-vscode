const vscode = require('vscode');
const appleCommands = require('./Commands/appleCommands');
const androidCommands = require('./Commands/androidCommands');
const windowsCommands = require('./Commands/windowsCommands');

function activate(context) {
  // iOS Commands
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.listProvisioningProfiles', appleCommands.listProvisioningProfiles));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.listSigningIdentities', appleCommands.listSigningIdentities));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishiOS', appleCommands.publishiOS));
  // Android Commands
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.checkKeyStoreSign', androidCommands.checkKeyStoreSign));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.generateCodeSigningKey', androidCommands.generateCodeSigningKey));
  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishAndroid', androidCommands.publishAndroid));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishWindows', windowsCommands.publishWindows));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.publishMacCatalyst', appleCommands.publishmacCatalyst));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:banditoth.VSCode-MAUI-Archive');
  }));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.androidTutorial', () => {
    vscode.env.openExternal(vscode.Uri.parse("https://learn.microsoft.com/en-us/dotnet/maui/android/deployment/"));
  }));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.iOSTutorial', () => {
    vscode.env.openExternal(vscode.Uri.parse("https://learn.microsoft.com/en-us/dotnet/maui/ios/deployment/"));
  }));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.windowsTutorial', () => {
    vscode.env.openExternal(vscode.Uri.parse("https://learn.microsoft.com/en-us/dotnet/maui/windows/deployment/overview"));
  }));

  context.subscriptions.push(vscode.commands.registerCommand('banditoth-maui-archive.macCatalystTutorial', () => {
    vscode.env.openExternal(vscode.Uri.parse("https://learn.microsoft.com/en-us/dotnet/maui/mac-catalyst/deployment"));
  }));

  console.log('Extension activated.');
}

module.exports = {
  activate
};
