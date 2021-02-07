// ============ Contracts ============

const { TWO_HUNDRED, ONE_HUNDRED } = require("./constants");


// Protocol
// const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");

const Timelock = artifacts.require("Timelock");

// deployed fourth
const YUANUSDxUSDCPool = artifacts.require("YUANUSDxUSDCPool");
const YUAN_USDxYUANPool = artifacts.require("YUANUSDxYUANPool");
const YUAN_ETHYUANPool = artifacts.require("YUANETHYUANPool");

// const YUAN_ETHYAMPool = artifacts.require("YUANETHYAMPool");
// const YUAN_ETHAMPLPool = artifacts.require("YUANETHAMPLPool");
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
  // let YUAN = await YUANProxy.deployed();
  // let tl = await Timelock.deployed();
  const eBTC = await eBTCProxy.deployed();
  const eETH = await eETHProxy.deployed();

  console.log('eBTC address:  ', eBTCProxy.address);
  console.log('eETH address:  ', eETHProxy.address);


  if (network != "test") {
    // await deployer.deploy(YUAN_USDxUSDCPool);
    // await deployer.deploy(YUAN_USDxYUANPool);
    // await deployer.deploy(YUAN_ETHYUANPool);
    // await deployer.deploy(YUAN_ETHYAMPool);
    // await deployer.deploy(YUAN_ETHAMPLPool);
    await deployer.deploy(eTokenUSDxUSDCPool);

    // const usdx_usdc_pool = new web3.eth.Contract(YUAN_USDxUSDCPool.abi, YUAN_USDxUSDCPool.address);
    // const usdx_yuan_pool = new web3.eth.Contract(YUAN_USDxYUANPool.abi, YUAN_USDxYUANPool.address);
    // const eth_yuan_pool = new web3.eth.Contract(YUAN_ETHYUANPool.abi, YUAN_ETHYUANPool.address);
    // const eth_yam_pool = new web3.eth.Contract(YUAN_ETHYAMPool.abi, YUAN_ETHYAMPool.address);
    // const eth_ampl_pool = new web3.eth.Contract(YUAN_ETHAMPLPool.abi, YUAN_ETHAMPLPool.address);
    const eUSDxUSDCPOOL = await eTokenUSDxUSDCPool.deployed();

    console.log("Setting distributor:");
    await Promise.all([
      // usdx_usdc_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
      // usdx_yuan_pool.methods.setRewardDistribution(accounts[0]).send({from: accounts[0], gas: 100000}),
      // eth_yuan_pool.methods.setRewardDistribution(accounts[0]).send({ from: accounts[0], gas: 100000 }),
      // eth_yam_pool.methods.setRewardDistribution(accounts[0]).send({ from: accounts[0], gas: 100000 }),
      // eth_ampl_pool.methods.setRewardDistribution(accounts[0]).send({ from: accounts[0], gas: 100000 }),
      eUSDxUSDCPOOL.setRewardDistribution(accounts[0]),
    ]);

    console.log("Transfering and notifying:");
    // console.log("eth");
    await Promise.all([
      // YUAN.transfer(YUAN_USDxUSDCPool.address, six_hundred.toString()),
      // YUAN.transfer(YUAN_ETHYUANPool.address, two_hundred.toString()),
      // YUAN.transfer(YUAN_USDxYUANPool.address, one_thousand_two_hundred.toString()),
      // YUAN.transfer(YUAN_ETHYAMPool.address, twenty.toString()),
      // YUAN.transfer(YUAN_ETHAMPLPool.address, twenty.toString()),

      eBTC.transfer(eTokenUSDxUSDCPool.address, TWO_HUNDRED.toString()),

      eETH.transfer(eTokenUSDxUSDCPool.address, ONE_HUNDRED.toString()),
    ]);

    await Promise.all([
      // usdx_usdc_pool.methods.notifyRewardAmount(six_hundred.toString()).send({from:accounts[0]}),
      // eth_yuan_pool.methods.notifyRewardAmount(two_hundred.toString()).send({ from: accounts[0] }),
      // usdx_yuan_pool.methods.notifyRewardAmount(one_thousand_two_hundred.toString()).send({from:accounts[0]}),
      // eth_yam_pool.methods.notifyRewardAmount(twenty.toString()).send({from:accounts[0]}),
      // eth_ampl_pool.methods.notifyRewardAmount(twenty.toString()).send({ from: accounts[0]}),
      eTokenUSDxUSDCPool.notifyRewardAmount(TWO_HUNDRED.toString(), ONE_HUNDRED.toString()),
    ]);

    // await Promise.all([
    //   usdx_usdc_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
    //   eth_yuan_pool.methods.setRewardDistribution(Timelock.address).send({ from: accounts[0], gas: 100000 }),
    //   usdx_yuan_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
    //   eth_yam_pool.methods.setRewardDistribution(Timelock.address).send({ from: accounts[0], gas: 100000 }),
    //   eth_ampl_pool.methods.setRewardDistribution(Timelock.address).send({from: accounts[0], gas: 100000}),
    // ]);

    // await Promise.all([
    //   usdx_usdc_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
    //   eth_yuan_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
    //   usdx_yuan_pool.methods.transferOwnership(Timelock.address).send({ from: accounts[0], gas: 100000 }),
    //   eth_yam_pool.methods.transferOwnership(Timelock.address).send({from: accounts[0], gas: 100000}),
    //   eth_ampl_pool.methods.transferOwnership(Timelock.address).send({ from: accounts[0], gas: 100000 }),
    // ]);
  }

  // console.log("USDxUSDC contract:  ", YUAN_USDxUSDCPool.address);
  // console.log("ETHYUAN contract:   ", YUAN_ETHYUANPool.address);
  // console.log("USDxYUAN contract:  ", YUAN_USDxYUANPool.address, "\n");
  // console.log("ETHYAM contract:    ", YUAN_ETHYAMPool.address);
  // console.log("ETHAMPL contract:   ", YUAN_ETHAMPLPool.address, "\n");
  console.log("eTokenUSDxUSDC contract:  ", eTokenUSDxUSDCPool.address);
}
