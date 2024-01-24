<img src="icon.png" width="120" height="120"/>

# .NET MAUI - Archive / Publish tool

![GitHub License](https://img.shields.io/github/license/banditoth/maui-archiver-vscode?style=for-the-badge)

![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/banditoth.VSCode-MAUI-Archive?style=for-the-badge&link=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dbanditoth.VSCode-MAUI-Archive)

![GitHub issues](https://img.shields.io/github/issues/banditoth/maui-archiver-vscode?style=for-the-badge)

The .NET MAUI - Archive / Publish tool extension for Visual Studio Code provides a set of essential tools to streamline the process of packaging and publishing .NET MAUI (Multi-platform App UI) projects. 
Whether you're targeting Android, iOS, or Windows platforms, this extension equips you with the necessary tools to manage provisioning profiles, keystore files.

## Supported platforms

| Android | iOS | Windows | MacCatalyst | Tizen |
| --- | --- | --- | --- | --- | 
| ✅ (macOS/Windows) | ✅ (macOS only) | Planned in Q1-2024 | Planned in Q2-2024 | ⛔️ |

## Roadmap

Q1 - 2024: 
- Windows publishing support
- Direct upload to Google Play
- Direct upload to TestFlight / AppStore

Q2 - 2024:
- MacCatalyst publish

## Installation

- Open Visual Studio Code.
- Go to the Extensions view (Ctrl+Shift+X).
- Search for ".NET MAUI - Archive / Publish tool"
- Click "Install" to add the extension to your VS Code setup.

## Visual Studio marketplace

![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/banditoth.VSCode-MAUI-Archive?style=for-the-badge&link=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dbanditoth.VSCode-MAUI-Archive)

Find it here:
https://marketplace.visualstudio.com/items?itemName=banditoth.VSCode-MAUI-Archive

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
<a href="https://www.flaticon.com/free-icons/iphone" title="iphone icons">Iphone icons created by khulqi Rosyid - Flaticon</a>

### Acknowledgements

Thanks to Gerald Versluis for spreading the word about this tool.
