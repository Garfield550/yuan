const { TWO_HUNDRED, ONE_HUNDRED, SIX_HUNDRED, ONE_THOUSAND_TWO_HUNDRED, TWENTY } = require("./constants");

// ============ Contracts ============


// Protocol
const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");

const Timelock = artifacts.require("Timelock");

// deployed fourth
const YUANUSDxUSDCPool = artifacts.require("YUANUSDxUSDCPool");
const YUANUSDxYUANPool = artifacts.require("YUANUSDxYUANPool");
const YUANETHYUANPool = artifacts.require("YUANETHYUANPool");
const YUANETHYAMPool = artifacts.require("YUANETHYAMPool");
const YUANETHAMPLPool = artifacts.require("YUANETHAMPLPool");
const eTokenUSDxUSDCPool = artifacts.require("eUSDxUSDCPool");


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
  const eBTC = await eBTCProxy.deployed();
  const eETH = await eETHProxy.deployed();

  console.log('YUAN address:  ', YUANProxy.address);
  console.log('eBTC address:  ', eBTCProxy.address);
  console.log('eETH address:  ', eETHProxy.address);


  if (network != "test") {
    await deployer.deploy(YUANUSDxUSDCPool, YUANProxy.address);
    await deployer.deploy(YUANUSDxYUANPool, YUANProxy.address);
    await deployer.deploy(YUANETHYUANPool, YUANProxy.address);
    await deployer.deploy(YUANETHYAMPool, YUANProxy.address);
    await deployer.deploy(YUANETHAMPLPool, YUANProxy.address);

    await deployer.deploy(eTokenUSDxUSDCPool, eBTCProxy.address, eETHProxy.address);

    const yUSDxUSDCPool = await YUANUSDxUSDCPool.deployed();
    const yUSDxYUANPool = await YUANUSDxYUANPool.deployed();
    const yETHYUANPool = await YUANETHYUANPool.deployed();
    const yETHYAMPool = await YUANETHYAMPool.deployed();
    const yETHAMPLPool = await YUANETHAMPLPool.deployed();

    const eUSDxUSDCPOOL = await eTokenUSDxUSDCPool.deployed();

    console.log("Setting distributor:");
    await Promise.all([
      yUSDxUSDCPool.setRewardDistribution(accounts[0]),
      yUSDxYUANPool.setRewardDistribution(accounts[0]),
      yETHYUANPool.setRewardDistribution(accounts[0]),
      yETHYAMPool.setRewardDistribution(accounts[0]),
      yETHAMPLPool.setRewardDistribution(accounts[0]),

      eUSDxUSDCPOOL.setRewardDistribution(accounts[0]),
    ]);

    console.log("Transfering and notifying:");
    await Promise.all([
      YUAN.transfer(YUANUSDxUSDCPool.address, SIX_HUNDRED.toString()),
      YUAN.transfer(YUANUSDxYUANPool.address, ONE_THOUSAND_TWO_HUNDRED.toString()),
      YUAN.transfer(YUANETHYUANPool.address, TWO_HUNDRED.toString()),
      YUAN.transfer(YUANETHYAMPool.address, TWENTY.toString()),
      YUAN.transfer(YUANETHAMPLPool.address, TWENTY.toString()),

      eBTC.transfer(eTokenUSDxUSDCPool.address, TWO_HUNDRED.toString()),
      eETH.transfer(eTokenUSDxUSDCPool.address, ONE_HUNDRED.toString()),
    ]);

    await Promise.all([
      yUSDxUSDCPool.notifyRewardAmount(SIX_HUNDRED.toString()),
      yUSDxYUANPool.notifyRewardAmount(ONE_THOUSAND_TWO_HUNDRED.toString()),
      yETHYUANPool.notifyRewardAmount(TWO_HUNDRED.toString()),
      yETHYAMPool.notifyRewardAmount(TWENTY.toString()),
      yETHAMPLPool.notifyRewardAmount(TWENTY.toString()),

      eUSDxUSDCPOOL.notifyRewardAmount(TWO_HUNDRED.toString(), ONE_HUNDRED.toString()),
    ]);

    await Promise.all([
      yUSDxUSDCPool.setRewardDistribution(Timelock.address),
      yUSDxYUANPool.setRewardDistribution(Timelock.address),
      yETHYUANPool.setRewardDistribution(Timelock.address),
      yETHYAMPool.setRewardDistribution(Timelock.address),
      yETHAMPLPool.setRewardDistribution(Timelock.address),

      eUSDxUSDCPOOL.setRewardDistribution(Timelock.address),
    ]);

    await Promise.all([
      yUSDxUSDCPool.transferOwnership(Timelock.address),
      yUSDxYUANPool.transferOwnership(Timelock.address),
      yETHYUANPool.transferOwnership(Timelock.address),
      yETHYAMPool.transferOwnership(Timelock.address),
      yETHAMPLPool.transferOwnership(Timelock.address),

      eUSDxUSDCPOOL.transferOwnership(Timelock.address),
    ]);
  }

  console.log("YUANUSDxUSDC contract:   ", YUANUSDxUSDCPool.address);
  console.log("YUANUSDxYUAN contract:   ", YUANUSDxYUANPool.address);
  console.log("YUANETHYUAN contract:    ", YUANETHYUANPool.address);
  console.log("YUANETHYAM contract:     ", YUANETHYAMPool.address);
  console.log("YUANETHAMPL contract:    ", YUANETHAMPLPool.address);
  console.log("eTokenUSDxUSDC contract: ", eTokenUSDxUSDCPool.address);
  console.log("\n");
}
