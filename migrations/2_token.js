// ============ Contracts ============

// Token
// deployed first
const YUANImplementation = artifacts.require("YUANDelegate");
const YUANProxy = artifacts.require("YUANDelegator");
const eETHImplementation = artifacts.require("eETHDelegate");
const eETHProxy = artifacts.require("eETHDelegator");
const eBTCImplementation = artifacts.require("eBTCDelegate");
const eBTCProxy = artifacts.require("eBTCDelegator");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployToken(deployer),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============

async function deployToken(deployer) {
  await deployer.deploy(YUANImplementation);
  await deployer.deploy(YUANProxy,
    "YUAN",
    "YUAN",
    18,
    "2240000000000000000000000", // print extra few mil for user
    YUANImplementation.address,
    "0x"
  );
  // eETH
  await deployer.deploy(eETHImplementation);
  await deployer.deploy(eETHProxy,
    "eETH",
    "eETH",
    18,
    "9960000000000000000000000",
    eETHImplementation.address,
    "0x"
  );
  // eBTC
  await deployer.deploy(eBTCImplementation);
  await deployer.deploy(eBTCProxy,
    "eBTC",
    "eBTC",
    18,
    "9876543210000000000000000",
    eBTCImplementation.address,
    "0x"
  );
}
