import * as dotenv from 'dotenv';
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

dotenv.config();

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (args, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

const alchemyKey = process.env.ALCHEMY_KEY;
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  mocha: { timeout: 2000000 },

  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
        // blockNumber: 11410700
        // blockNumber: 11411338
        // blockNumber: 11274577,
      },
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.5.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
};

export default config;
