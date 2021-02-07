const Web3 = require("web3");

const tokens = {
  yuan: {
    reserveToken: { // USDx Token
      mainnet: "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
      testnet: "0xB29A26df2702B10BFbCf8cd52914Ad1fc99A4540",
      kovan: "0xFe1F0C31F4f477569622E284baBa0a6F030c6ea6"
    },
    uniswapFactory: {
      mainnet: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
      kovan: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    },
    oraclePoster: {
      mainnet: "0x6e8e3697Ff41d021D4D7a988c3CDF504cd6BD26f",
      testnet: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715",
      kovan: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715"
    }
  },
  eETH: {
    reserveToken: { // YUAN Token
      mainnet: "0x4A3e164684812DfB684AC36457E7fA805087c68E",
      testnet: "0x25ecDD98D8AfE1f18ED6B5f0E017813Db59a2F0b",
      kovan: "0x08c89ADe94f830BA094529B782576e8525FB93d6",
    },
    uniswapFactory: {
      mainnet: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
      kovan: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    },
    oraclePoster: {
      mainnet: "0x6e8e3697Ff41d021D4D7a988c3CDF504cd6BD26f",
      testnet: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715",
      kovan: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715"
    },
    ethToken: { // WETH Token
      mainnet: "",
      testnet: "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
      kovan: "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
    }
  },
  eBTC: {
    reserveToken: { // YUAN Token
      mainnet: "0x4A3e164684812DfB684AC36457E7fA805087c68E",
      testnet: "0x25ecDD98D8AfE1f18ED6B5f0E017813Db59a2F0b",
      kovan: "0x08c89ADe94f830BA094529B782576e8525FB93d6",
    },
    uniswapFactory: {
      mainnet: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      testnet: "0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470",
      kovan: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    },
    oraclePoster: {
      mainnet: "0x6e8e3697Ff41d021D4D7a988c3CDF504cd6BD26f",
      testnet: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715",
      kovan: "0x923Fe0dc3b2b3477d921BA8859e6b68F5cD97715"
    },
    btcToken: { // WBTC Token
      mainnet: "",
      testnet: "",
      kovan: "0x395089827f23d4605c1bce4a56663657d8e8b104"
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
