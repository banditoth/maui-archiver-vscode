# .NET MAUI - Archive / Publish tool

The .NET MAUI - Archive / Publish tool extension for Visual Studio Code provides a set of essential tools to streamline the process of packaging and publishing .NET MAUI (Multi-platform App UI) projects. 
Whether you're targeting Android, iOS, or Windows platforms, this extension equips you with the necessary tools to manage provisioning profiles, keystore files.

** This project is currently under active development **

## Availability

https://marketplace.visualstudio.com/items?itemName=banditoth.VSCode-MAUI-Archive

## Installation

- Open Visual Studio Code.
- Go to the Extensions view (Ctrl+Shift+X).
- Search for ".NET MAUI - Archive / Publish tool"
- Click "Install" to add the extension to your VS Code setup.

## Usage

- Open your .NET MAUI project in Visual Studio Code.
- Access the Command Palette (Ctrl+Shift+P).

## Available commands

`MAUI Archive: Publish Android`
Initiates the process of publishing a .NET MAUI app for the Android platform. Users can choose between signed and unsigned builds, apk and aab formats.

`MAUI Archive: Publish iOS`
Initiates the process of publishing a .NET MAUI app for the iOS platform. Users can choose signing profiles and keys.

`MAUI Archive: iOS - List of Provisioning Profiles`
Lists all available provisioning profiles installed on the machine for iOS projects.

`MAUI Archive: Android - List of Keystores & Check Signature`
Lists all keystores. Additionally, allows users to check the signature of a selected keystore.

`MAUI Archive: Android - Generate Code Signing Key`
Prompts the required paramters and executes the necessary command (`keytool -genkeypair`) to generate a code signing key for Android apps.

`MAUI Archive: Settings`
Opens the settings for the MAUI Archive extension, allowing users to configure parameters such as output paths and Android keystore list paths.


## Planned features
- Windows (UWP) publish process
- Google Play integration
- AppStore integration

## Issues / feedback

Your feedback is valuable! If you encounter any issues or have suggestions for improvement, please submit an issue on GitHub.
https://github.com/banditoth/maui-archiver-vscode/

## Contributing

Pull requests are welcomed. 
For major changes, please open a discussion first.

## Icon
<a href="https://www.flaticon.com/free-icons/rocket-launch" title="rocket launch icons">Rocket launch icons created by Hamstring - Flaticon</a>
