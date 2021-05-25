const Web3 = require("web3");

const tokens = {
  yuan: {
    reserveToken: { // USDx Token
      testnet: "0xA5596654d7AA746f47920362C0C9318d708B20f9",
    },
    uniswapFactory: {
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
    },
    oraclePoster: {
      testnet: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715",
    }
  },
  eETH: {
    reserveToken: { // YUAN Token
      testnet: "",
    },
    uniswapFactory: {
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
    },
    ethToken: { // WETH Token
      testnet: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    }
  },
  eBTC: {
    reserveToken: { // YUAN Token
      testnet: "",
    },
    uniswapFactory: {
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
    },
    btcToken: { // WBTC Token
      testnet: "0x4f20f309281AB2F6E8fD9e131c1BeD6F980832f5",
    }
  }
}

const ZERO = "0x0000000000000000000000000000000000000000"

const web3 = new Web3();
const ONE_HUNDRED = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(100));
// USDx-USDC: 600,000
const SIX_HUNDRED = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(600));
// YUAN-ETH: 200,000
const TWO_HUNDRED = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(200));
// USDx-YUAN: 1,200,000
const ONE_THOUSAND_TWO_HUNDRED = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(1200));
// USDC-ETH, DAI-ETH, USDT-ETH, USDx-ETH, YAM-ETH, AMPL-ETH, UNI-ETH, YFI-ETH,
// DF-ETH, YFII-ETH, LINK-ETH, BAND-ETH: 20,000
const TWENTY = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(20));
// Incentive YUAN-USDx: 40w * 30% => 120,000
const ONE_HUNDRED_TWENTY = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(120));
// Incentive YUAN-ETH: 40w * 70% => 280,000
const TWO_HUNDRED_EIGHTY = web3.utils.toBN(10 ** 3).mul(web3.utils.toBN(10 ** 18)).mul(web3.utils.toBN(280));


module.exports = {
  ZERO,
  tokens,
  SIX_HUNDRED,
  TWO_HUNDRED,
  ONE_THOUSAND_TWO_HUNDRED,
  TWENTY,
  ONE_HUNDRED_TWENTY,
  TWO_HUNDRED_EIGHTY,
  ONE_HUNDRED
}
