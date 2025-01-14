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
| ✅ (macOS/Windows) | ✅ (macOS only) | ✅ (Windows only) | Planned in Q1-2025 | ⛔️ |

## Roadmap

Q1 - 2025: 
- Direct upload to Google Play
- Direct upload to TestFlight / AppStore
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

### Publishing

`MAUI Archive: Publish Android`
Initiates the process of publishing a .NET MAUI app for the Android platform. Users can choose between signed and unsigned builds, apk and aab formats.

`MAUI Archive: Publish iOS`
Initiates the process of publishing a .NET MAUI app for the iOS platform. Users can choose signing profiles and keys.

`MAUI Archive: Publish Windows`
Initiates the process of publishing a .NET MAUI app for the Windows platform. Users can choose between packaged and non packaged apps.

### Additional commands

`MAUI Archive: iOS - List of Provisioning Profiles`
Lists all available provisioning profiles installed on the machine for iOS projects.

`MAUI Archive: Android - Check Signature of keystore`
Lists all keystores. Additionally, allows users to check the signature of a selected keystore.

`MAUI Archive: Android - Generate Code Signing Key`
Prompts the required paramters and executes the necessary command (`keytool -genkeypair`) to generate a code signing key for Android apps.

### Tutorials

`MAUI Archive: Documentation of publishing Android apps (Microsoft)`
`MAUI Archive: Documentation of publishing iOS apps (Microsoft)`
`MAUI Archive: Documentation of publishing Windows apps (Microsoft)`

Opens the browser with additional information about the archive / publish process of each platform (learn.microsoft.com)

### Settings

`MAUI Archive: Settings`
Opens the settings for the MAUI Archive extension, allowing users to configure parameters such as output paths and Android keystore list paths.

#### Values

| Setting name | Description | Default Value |
| --- | --- | --- |
| Build configuration | You can specify a custom build configuration when publishing your apps | 'Release' |
| Dotnet version | You can specify a custom dotnet version like net7.0 when publishing your apps | 'net9.0' |
| Enable Solution file format | When searching the workspace for .csproj files, this setting enabled the discovery of .sln files aswell | 'false' |
| Android keystore directory | You can specify a custom directory path to your Android keystore files | - |
| Android key tool path | Set a custom directory where your Android keystores are located at. Leave blank for default. | - |
| Android JDK version | Set the version for compatibility with Java Development kit. Get the version with 'java --version' Recommended: Microsoft OpenJDK 17 or up. | 'jdk17+' |
| Use explicit Android version | You can specify a custom version of Android to use as a target framework | - |
| iOS Runtime identifier | You can change the default architeture for iOS apps | 'ios-arm64' |
| Use explicit iOS version | You can specify a custom version of iOS to use as a target framework | - |
| iOS Provisioning profiles path | Set a custom directory where your iOS Provisioning Profiles are located at. Leave blank for default. (Developer/XCode/UserData/ProvisioningProfiles) | - |
| Use explicit Windows version | You can specify a custom version of Windows to use as a target framework. Always use a value, do not leave it blank | '10.0.19041.0' |

## Issues / feedback

Your feedback is valuable! If you encounter any issues or have suggestions for improvement, please submit an issue on GitHub.
https://github.com/banditoth/maui-archiver-vscode/

## Contributing

Pull requests are welcomed. 
For major changes, please open a discussion first.

## Icon
<a href="https://www.flaticon.com/free-icons/iphone" title="iphone icons">Iphone icons created by khulqi Rosyid - Flaticon</a>

### Acknowledgements

Thanks to Gerald Versluis and James Montemagno for spreading the word about this tool.

