require('dotenv').config();

// ============ Contracts ============

// Token
// deployed first
const YUANProxy = artifacts.require("YUANDelegator");
const Oracle = artifacts.require("PriceOracle");

// Rs
// deployed second
const YUANReserves = artifacts.require("YUANReserves");
const YUANRebaser = artifacts.require("YUANRebaserV2");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployRs(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============


async function deployRs(deployer, network) {
  let reserveToken = process.env.RESERVE_TOKEN;
  let uniswap_factory = process.env.UNISWAP_FACYORY;
  let oraclePoster = process.env.ORACLE_POSTER;
  let zeroAddress = '0x0000000000000000000000000000000000000000'
  let yuan = await YUANProxy.deployed();

  await deployer.deploy(Oracle, oraclePoster, "50000000000000000")
  await deployer.deploy(YUANReserves, reserveToken, YUANProxy.address);
  await deployer.deploy(YUANRebaser,
      YUANProxy.address,
      reserveToken,
      uniswap_factory,
      [YUANReserves.address, zeroAddress, zeroAddress],
      zeroAddress,
      0,
      // Oracle.address
  );

  let rebase = new web3.eth.Contract(YUANRebaser.abi, YUANRebaser.address);

  let pair = await rebase.methods.uniswap_pair().call();
  console.log("uniswap pair is: ", pair)

  await yuan._setRebaser(YUANRebaser.address);
  let reserves = await YUANReserves.deployed();
  await reserves._setRebaser(YUANRebaser.address)
}
