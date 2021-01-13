const { ZERO, tokens } = require('./constants');

// ============ Contracts ============

// Token
// deployed first
const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");

// Rs
// deployed second
const Oracle = artifacts.require("PriceOracle");
const YUANReserves = artifacts.require("YUANReservesV2");
const YUANRebaser = artifacts.require("YUANRebaser");
const eETHReserves = artifacts.require("eETHReserves");
const YUANRebaserV2 = artifacts.require("YUANRebaserV2"); // eETHRebaser

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployRs(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============

async function deployRs(deployer, network) {
  const reserveToken = tokens.yuan.reserveToken[network]; // USDx
  const uniswapFactory = tokens.yuan.uniswapFactory[network];
  const oraclePoster = tokens.yuan.oraclePoster[network];
  const yuan = await YUANProxy.deployed();

  await deployer.deploy(Oracle, oraclePoster, "50000000000000000");
  await deployer.deploy(YUANReserves, reserveToken, YUANProxy.address);
  await deployer.deploy(YUANRebaser,
    YUANProxy.address,
    reserveToken,
    uniswapFactory,
    [YUANReserves.address, ZERO, ZERO],
    ZERO,
    0,
    Oracle.address
  );

  const rebase = new web3.eth.Contract(YUANRebaser.abi, YUANRebaser.address);
  const pair = await rebase.methods.uniswap_pair().call();
  console.log("YUAN Uniswap pair is:", pair);

  await yuan._setRebaser(YUANRebaser.address);
  const reserves = await YUANReserves.deployed();
  await reserves._setRebaser(YUANRebaser.address);

  // eETH
  const reserveTokenETH = tokens.eETH.reserveToken[network]; // ETH
  const uniswapFactoryETH = tokens.eETH.uniswapFactory[network];
  const eETH = await eETHProxy.deployed();

  await deployer.deploy(eETHReserves, reserveTokenETH, eETHProxy.address);
  await deployer.deploy(YUANRebaserV2,
    eETHProxy.address,
    reserveTokenETH,
    uniswapFactoryETH,
    [eETHReserves.address, ZERO, ZERO],
    ZERO,
    0
  );

  const rebaseETH = new web3.eth.Contract(YUANRebaserV2.abi, YUANRebaserV2.address);
  const pairETH = await rebaseETH.methods.uniswap_pair().call();
  console.log("eETH Uniswap pair is:", pairETH); // eETH/ETH

  await eETH._setRebaser(YUANRebaserV2.address);
  const reservesETH = await eETHReserves.deployed();
  await reservesETH._setRebaser(YUANRebaserV2.address);
}
