const { TWENTY } = require("./constants");

// ============ Contracts ============


// Protocol
const YUANProxy = artifacts.require("YUANDelegator");
const Timelock = artifacts.require("Timelock");

const YUANETHDFPool = artifacts.require("YUANETHDFPool");
const YUANETHYFIPool = artifacts.require("YUANETHYFIPool");
const YUANETHUNIPPool = artifacts.require("YUANETHUNIPool");
const YUANETHYFIIPool = artifacts.require("YUANETHYFIIPool");
const YUANETHLINKPool = artifacts.require("YUANETHLINKPool");
const YUANETHBANDPool = artifacts.require("YUANETHBANDPool");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployDistribution(deployer, network, accounts),
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  const YUAN = await YUANProxy.deployed();
  const TL = await Timelock.deployed();

  console.log('YUAN address:  ', YUANProxy.address);


  if (network != "test") {
    await deployer.deploy(YUANETHDFPool, YUANProxy.address);
    await deployer.deploy(YUANETHYFIPool, YUANProxy.address);
    await deployer.deploy(YUANETHUNIPPool, YUANProxy.address);
    await deployer.deploy(YUANETHYFIIPool, YUANProxy.address);
    await deployer.deploy(YUANETHLINKPool, YUANProxy.address);
    await deployer.deploy(YUANETHBANDPool, YUANProxy.address);

    const yETHDFPool = await YUANETHDFPool.deployed();
    const yETHYFIPool = await YUANETHYFIPool.deployed();
    const yETHUNIPool = await YUANETHUNIPPool.deployed();
    const yETHYFIIPool = await YUANETHYFIIPool.deployed();
    const yETHLINKPool = await YUANETHLINKPool.deployed();
    const yETHBANDPool = await YUANETHBANDPool.deployed();

    console.log("\nSetting distributor...");
    await Promise.all([
      yETHDFPool.setRewardDistribution(accounts[0]),
      yETHYFIPool.setRewardDistribution(accounts[0]),
      yETHUNIPool.setRewardDistribution(accounts[0]),
      yETHYFIIPool.setRewardDistribution(accounts[0]),
      yETHLINKPool.setRewardDistribution(accounts[0]),
      yETHBANDPool.setRewardDistribution(accounts[0]),
    ]);

    console.log("Transfering and notifying...");
    await Promise.all([
      YUAN.transfer(YUANETHDFPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHYFIPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHUNIPPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHYFIIPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHLINKPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHBANDPool.address, TWENTY.toString()),
    ]);

    await Promise.all([
      yETHDFPool.notifyRewardAmount(TWENTY.toString()),
      yETHYFIPool.notifyRewardAmount(TWENTY.toString()),
      yETHUNIPool.notifyRewardAmount(TWENTY.toString()),
      yETHYFIIPool.notifyRewardAmount(TWENTY.toString()),
      yETHLINKPool.notifyRewardAmount(TWENTY.toString()),
      yETHBANDPool.notifyRewardAmount(TWENTY.toString()),
    ]);

    await Promise.all([
      yETHDFPool.setRewardDistribution(Timelock.address),
      yETHYFIPool.setRewardDistribution(Timelock.address),
      yETHUNIPool.setRewardDistribution(Timelock.address),
      yETHYFIIPool.setRewardDistribution(Timelock.address),
      yETHLINKPool.setRewardDistribution(Timelock.address),
      yETHBANDPool.setRewardDistribution(Timelock.address),
    ]);
    await Promise.all([
      yETHDFPool.transferOwnership(Timelock.address),
      yETHYFIPool.transferOwnership(Timelock.address),
      yETHUNIPool.transferOwnership(Timelock.address),
      yETHYFIIPool.transferOwnership(Timelock.address),
      yETHLINKPool.transferOwnership(Timelock.address),
      yETHBANDPool.transferOwnership(Timelock.address),
    ]);
  }

  console.log("\n");
  console.log("ETHDF contract:     ", YUANETHDFPool.address);
  console.log("ETHYFI contract:    ", YUANETHYFIPool.address);
  console.log("ETHUNI contract:    ", YUANETHUNIPPool.address);
  console.log("ETHYFII contract:   ", YUANETHYFIIPool.address);
  console.log("ETHLINK contract:   ", YUANETHLINKPool.address);
  console.log("ETHBAND contract:   ", YUANETHBANDPool.address);
  console.log("\n");
}
