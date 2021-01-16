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

  const rebase = new web3.eth.Contract(YUANRebaser.abi, YUANRebaser.address);
  const pair = await rebase.methods.uniswap_pair().call();
  console.log("YUAN Uniswap pair is:", pair); // YUAN/USDx

  await yuan._setRebaser(YUANRebaser.address);
  const reserves = await YUANReserves.deployed();
  await reserves._setRebaser(YUANRebaser.address);
  //#endregion

  //#region eETH Deploy
  const reserveTokenETH = tokens.eETH.reserveToken[network]; // YUAN
  const uniswapFactoryETH = tokens.eETH.uniswapFactory[network];
  const ethToken = tokens.eETH.ethToken[network]; // WETH
  const eETH = await eETHProxy.deployed();

  await deployer.deploy(eETHReserves, reserveTokenETH, eETHProxy.address);
  await deployer.deploy(eETHRebaser,
    eETHProxy.address,
    reserveTokenETH, // If you want to fully deployed contracts that include YUAN, you can use YUANProxy.address
    uniswapFactoryETH,
    [eETHReserves.address, ZERO, ZERO],
    ZERO,
    0,
    ethToken
  );

  const rebaseETH = new web3.eth.Contract(eETHRebaser.abi, eETHRebaser.address);
  const pairETH = await rebaseETH.methods.uniswap_pair().call();
  const twapPairETH = await rebaseETH.methods.uniswapTwapPair().call();
  console.log("eETH Uniswap pair is:", pairETH); // eETH/YUAN
  console.log("eETH Uniswap TWAP pair is:", twapPairETH); // eETH/ETH

  await eETH._setRebaser(eETHRebaser.address);
  const reservesETH = await eETHReserves.deployed();
  await reservesETH._setRebaser(eETHRebaser.address);
  //#endregion

  //#region eBTC Deploy
  const reserveTokenBTC = tokens.eBTC.reserveToken[network]; // YUAN
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

  const rebaseBTC = new web3.eth.Contract(eBTCRebaser.abi, eBTCRebaser.address);
  const pairBTC = await rebaseBTC.methods.uniswap_pair().call();
  const twapPairBTC = await rebaseBTC.methods.uniswapTwapPair().call();
  console.log("eBTC Uniswap pair is:", pairBTC); // eBTC/YUAN
  console.log("eBTC Uniswap TWAP pair is:", twapPairBTC); // eBTC/BTC

  await eBTC._setRebaser(eBTCRebaser.address);
  const reservesBTC = await eBTCReserves.deployed();
  await reservesBTC._setRebaser(eBTCRebaser.address);
  //#endregion
}
