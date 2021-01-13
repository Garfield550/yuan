// ============ Contracts ============


// Token
// deployed first
// const YUANImplementation = artifacts.require("YUANDelegate");
const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");

// Rs
// deployed second
// const YUANReserves = artifacts.require("YUANReservesV2");
// const YUANRebaser = artifacts.require("YUANRebaser");
// const YUANRebaserV2 = artifacts.require("YUANRebaserV2");

// Governance
// deployed third
const Gov = artifacts.require("GovernorAlpha");
const Timelock = artifacts.require("Timelock");
const eETHGov = artifacts.require("eETHGovernorAlphaV2");
const eETHTimelock = artifacts.require("eETHTimelock");


// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployGovernance(deployer),
  ]);
};

module.exports = migration;

// ============ Deploy Functions ============
// This is split across multiple files so that
// if the web3 provider craps out, all progress isn't lost.
//
// This is at the expense of having to do 6 extra txs to sync the migrations
// contract

async function deployGovernance(deployer) {
  await deployer.deploy(Timelock);
  await deployer.deploy(Gov,
    Timelock.address,
    YUANProxy.address
  );
  // eETH
  await deployer.deploy(eETHTimelock);
  await deployer.deploy(eETHGov,
    eETHTimelock.address,
    eETHProxy.address
  );
}
