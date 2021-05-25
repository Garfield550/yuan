const { TWENTY } = require("./constants");

// ============ Contracts ============


// Protocol
const YUANProxy = artifacts.require("YUANDelegator");
const Timelock = artifacts.require("Timelock");

const YUANETHUSDCPool = artifacts.require("YUANETHUSDCPool");
const YUANETHUSDTPool = artifacts.require("YUANETHUSDTPool");
const YUANETHUSDxPool = artifacts.require("YUANETHUSDxPool");
const YUANETHDAIPool = artifacts.require("YUANETHDAIPool");


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
    await deployer.deploy(YUANETHUSDCPool, YUANProxy.address);
    await deployer.deploy(YUANETHUSDTPool, YUANProxy.address);
    await deployer.deploy(YUANETHUSDxPool, YUANProxy.address);
    await deployer.deploy(YUANETHDAIPool, YUANProxy.address);

    const yETHUSDCPool = await YUANETHUSDCPool.deployed();
    const yETHUSDTPool = await YUANETHUSDTPool.deployed();
    const yETHUSDxPool = await YUANETHUSDxPool.deployed();
    const yETHDAIPool = await YUANETHDAIPool.deployed();

    console.log("Setting distributor:");
    await Promise.all([
      yETHUSDCPool.setRewardDistribution(accounts[0]),
      yETHUSDTPool.setRewardDistribution(accounts[0]),
      yETHUSDxPool.setRewardDistribution(accounts[0]),
      yETHDAIPool.setRewardDistribution(accounts[0]),
    ]);

    console.log("Transfering and notifying:");
    await Promise.all([
      YUAN.transfer(YUANETHUSDCPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHUSDTPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHUSDxPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHDAIPool.address, TWENTY.toString()),
    ]);

    await Promise.all([
      yETHUSDCPool.notifyRewardAmount(TWENTY.toString()),
      yETHUSDTPool.notifyRewardAmount(TWENTY.toString()),
      yETHUSDxPool.notifyRewardAmount(TWENTY.toString()),
      yETHDAIPool.notifyRewardAmount(TWENTY.toString()),
    ]);

    await Promise.all([
      yETHUSDCPool.setRewardDistribution(Timelock.address),
      yETHUSDTPool.setRewardDistribution(Timelock.address),
      yETHUSDxPool.setRewardDistribution(Timelock.address),
      yETHDAIPool.setRewardDistribution(Timelock.address),
    ]);

    await Promise.all([
      yETHUSDCPool.transferOwnership(Timelock.address),
      yETHUSDTPool.transferOwnership(Timelock.address),
      yETHUSDxPool.transferOwnership(Timelock.address),
      yETHDAIPool.transferOwnership(Timelock.address),
    ]);
  }

  console.log("YUANETHUSDC contract:   ", YUANETHUSDCPool.address);
  console.log("YUANETHUSDT contract:   ", YUANETHUSDTPool.address);
  console.log("YUANETHUSDx contract:   ", YUANETHUSDxPool.address);
  console.log("YUANETHDAI contract:    ", YUANETHDAIPool.address);
  console.log("\n");
}
