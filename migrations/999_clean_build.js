const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    generateCleanBuild(),
  ]);
};

module.exports = migration;


// ============ Deploy Functions ============

async function generateCleanBuild() {
  const outputDirPath = path.resolve(__dirname, '..', 'clean_build/contracts');
  fs.mkdirSync(outputDirPath, {
    recursive: true,
  });

  const buildDirPath = path.resolve(__dirname, '..', 'build/contracts');
  const buildJSONFiles = fs.readdirSync(buildDirPath).filter(fileName => fileName.endsWith('.json'));
  const buildJSONPromises = buildJSONFiles.map(async (fileName) => {
    const jsonFilePath = path.resolve(buildDirPath, fileName);
    const jsonData = require(jsonFilePath);

    const networksKeys = Object.keys(jsonData.networks);
    const networksData = {};
    networksKeys.forEach(key => {
      networksData[key] = {
        address: jsonData.networks[key].address || '',
        transactionHash: jsonData.networks[key].transactionHash || '',
      }
    });

    const outputJSONData = {
      abi: jsonData.abi,
      networks: networksData,
    }

    const outputFilePath = path.resolve(outputDirPath, fileName);
    return await writeFile(outputFilePath, JSON.stringify(outputJSONData, null, 2));
  });
  await Promise.all(buildJSONPromises);
}
