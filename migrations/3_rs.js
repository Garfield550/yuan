const { ZERO, tokens } = require('./constants');

// ============ Contracts ============

// Token
// deployed first
const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");

// Rs
// deployed second
const Oracle = artifacts.require("PriceOracle");
const YUANReserves = artifacts.require("YUANReservesV2");
const YUANRebaser = artifacts.require("YUANRebaser");
const eETHReserves = artifacts.require("eETHReserves");
const eETHRebaser = artifacts.require("eETHRebaser");
const eBTCReserves = artifacts.require("eBTCReserves");
const eBTCRebaser = artifacts.require("eBTCRebaser");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployRs(deployer, network),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============

async function deployRs(deployer, network) {
  //#region YUAN Deploy
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

  const rebase = YUANRebaser.deployed();
  const pair = await rebase.uniswap_pair();
  console.log("YUAN Uniswap pair is:", pair); // YUAN/USDx

  await yuan._setRebaser(YUANRebaser.address);
  const reserves = await YUANReserves.deployed();
  await reserves._setRebaser(YUANRebaser.address);
  //#endregion

  //#region eETH Deploy
  // If you want to fully deployed contracts that include YUAN, you can use YUANProxy.address
  // const reserveTokenETH = tokens.eETH.reserveToken[network]; // YUAN
  const reserveTokenETH = YUANProxy.address; // YUAN
  const uniswapFactoryETH = tokens.eETH.uniswapFactory[network];
  const ethToken = tokens.eETH.ethToken[network]; // WETH
  const eETH = await eETHProxy.deployed();

  await deployer.deploy(eETHReserves, reserveTokenETH, eETHProxy.address);
  await deployer.deploy(eETHRebaser,
    eETHProxy.address,
    reserveTokenETH,
    uniswapFactoryETH,
    [eETHReserves.address, ZERO, ZERO],
    ZERO,
    0,
    ethToken
  );

  const rebaseETH = await eETHRebaser.deployed();
  const pairETH = await rebaseETH.uniswap_pair();
  const twapPairETH = await rebaseETH.uniswapTwapPair();
  console.log("eETH Uniswap pair is:", pairETH); // eETH/YUAN
  console.log("eETH Uniswap TWAP pair is:", twapPairETH); // eETH/ETH

  await eETH._setRebaser(eETHRebaser.address);
  const reservesETH = await eETHReserves.deployed();
  await reservesETH._setRebaser(eETHRebaser.address);
  //#endregion

  //#region eBTC Deploy
  // const reserveTokenBTC = tokens.eBTC.reserveToken[network]; // YUAN
  const reserveTokenBTC = YUANProxy.address; // YUAN
  const uniswapFactoryBTC = tokens.eBTC.uniswapFactory[network];
  const btcToken = tokens.eBTC.btcToken[network]; // WBTC
  const eBTC = await eBTCProxy.deployed();

  await deployer.deploy(eBTCReserves, reserveTokenBTC, eBTCProxy.address);
  await deployer.deploy(eBTCRebaser,
    eBTCProxy.address,
    reserveTokenBTC,
    uniswapFactoryBTC,
    [eBTCReserves.address, ZERO, ZERO],
    ZERO,
    0,
    btcToken
  );

  const rebaseBTC = await eBTCRebaser.deployed();
  const pairBTC = await rebaseBTC.uniswap_pair();
  const twapPairBTC = await rebaseBTC.uniswapTwapPair();
  console.log("eBTC Uniswap pair is:", pairBTC); // eBTC/YUAN
  console.log("eBTC Uniswap TWAP pair is:", twapPairBTC); // eBTC/BTC

  await eBTC._setRebaser(eBTCRebaser.address);
  const reservesBTC = await eBTCReserves.deployed();
  await reservesBTC._setRebaser(eBTCRebaser.address);
  //#endregion
}
