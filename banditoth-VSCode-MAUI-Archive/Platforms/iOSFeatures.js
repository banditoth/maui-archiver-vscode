const { exec } = require('child_process');

module.exports = {
    getProvisioningProfiles: getProvisioningProfiles,
    getKeysByProvisioningProfile: getKeysByProvisioningProfile,
    getAllCodeSigningInfo: getAllCodeSigningInfo,
    getProfilesForSigningKey: getProfilesForSigningKey,
    parseCodeSigningInfo: parseCodeSigningInfo,
}

/// <summary>
/// Returns the available provisioning profiles.
/// </summary>
// todo: simplify this, and make it more generic
async function getProvisioningProfiles() {
    return new Promise((resolve, reject) => {
        exec('security find-identity -p codesigning -v', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject([]);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject([]);
                return;
            }

            const info = parseCodeSigningInfo(stdout);
            const provisioningProfiles = info.map(item => item.profile);
            resolve(provisioningProfiles);
        });
    });
}

// todo: simplify this, and make it more generic
async function getKeysByProvisioningProfile(provisioningProfile) {
    const allSigningKeys = await getAllCodeSigningInfo();
    const keysForProfile = allSigningKeys.filter(item => item.profiles.includes(provisioningProfile));
    return keysForProfile.map(item => item.key);
}

// todo: simplify this, and make it more generic
async function getAllCodeSigningInfo() {
    return new Promise((resolve, reject) => {
        exec('security find-identity -p codesigning -v', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject([]);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject([]);
                return;
            }

            const info = parseCodeSigningInfo(stdout);
            const signingKeys = info.map(item => ({ key: item.thumbprint, profiles: [] }));

            for (const keyInfo of signingKeys) {
                keyInfo.profiles = getProfilesForSigningKey(keyInfo.key, info);
            }

            resolve(signingKeys);
        });
    });
}

function getProfilesForSigningKey(signingKey, allCodeSigningInfo) {
    const profiles = [];
    for (const item of allCodeSigningInfo) {
        if (item.thumbprint === signingKey) {
            profiles.push(item.profile);
        }
    }
    return profiles;
}

/// <summary>
/// Magicly parses the output of the security command.
/// </summary>
function parseCodeSigningInfo(output) {
    const lines = output.split('\n');
    const info = [];

    for (const line of lines) {
        const match = line.match(/^\s*\d+\)\s+(\S+)\s+"(.+)"$/);
        if (match) {
            const thumbprint = match[1];
            const profile = match[2];
            info.push({ thumbprint, profile });
        }
    }

    return info;
}