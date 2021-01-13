const tokens = {
  yuan: {
    reserveToken: {
      mainnet: "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549",
      testnet: "0xB29A26df2702B10BFbCf8cd52914Ad1fc99A4540",
      kovan: ""
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
    reserveToken: {
      mainnet: "",
      testnet: "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
      kovan: "0x5eCA15B12d959dfcf9c71c59F8B467Eb8c6efD0b" // WETH
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
  }
}

const ZERO = "0x0000000000000000000000000000000000000000"

module.exports = {
  ZERO,
  tokens
}
