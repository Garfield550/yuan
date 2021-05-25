const { ONE_HUNDRED_TWENTY, TWO_HUNDRED_EIGHTY, tokens } = require('./constants');

// ============ Contracts ============


// Protocol
// deployed helper
const APY = artifacts.require("CalculateApy");

// deployed second
const YUANProxy = artifacts.require("YUANDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");
const eETHProxy = artifacts.require("eETHDelegator");
const Timelock = artifacts.require("Timelock");

// deployed fifth
const YUANETHIncentivizer = artifacts.require("YUANETHIncentivizer");
const YUANUSDxIncentivizer = artifacts.require("YUANUSDxIncentivizer");
const YUANRewardDistributor = artifacts.require("RewardDistributor");
const eBTCYUANIncentivizer = artifacts.require("eBTCYUANIncentivizer");
const eBTCRewardDistributor = artifacts.require("eBTCRewardDistributor");
const eETHYUANIncentivizer = artifacts.require("eETHYUANIncentivizer");
const eETHRewardDistributor = artifacts.require("eETHRewardDistributor");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployDistribution(deployer, network, accounts),
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  const TL = await Timelock.deployed();
  const YUAN = await YUANProxy.deployed();
  const eBTC = await eBTCProxy.deployed();
  const eETH = await eETHProxy.deployed();

  console.log('YUAN address:  ', YUANProxy.address);
  console.log('eBTC address:  ', eBTCProxy.address);
  console.log('eETH address:  ', eETHProxy.address);

  if (network != "test") {
    // deploy apy contract
    await deployer.deploy(APY, YUANProxy.address);

    await deployer.deploy(YUANETHIncentivizer, YUANProxy.address);
    await deployer.deploy(YUANUSDxIncentivizer, YUANProxy.address);
    await deployer.deploy(YUANRewardDistributor, YUANProxy.address);

    // Deploy eBTCRewardDistributor and eBTCYUANIncentivizer contract
    await deployer.deploy(eBTCRewardDistributor, eBTCProxy.address);
    await deployer.deploy(eBTCYUANIncentivizer, YUANProxy.address, eBTCProxy.address);
    // Deploy eETHRewardDistributor and eETHYUANIncentivizer contract
    await deployer.deploy(eETHRewardDistributor, eETHProxy.address);
    await deployer.deploy(eETHYUANIncentivizer, YUANProxy.address, eETHProxy.address);

    const yuanAPY = await APY.deployed();
    const reserveToken = tokens.yuan.reserveToken[network];
    const weth = tokens.eETH.ethToken[network];

    // set swap route
    const stableSwapPath = [YUANProxy.address, reserveToken];
    const ethSwapPath = [weth, reserveToken];

    const yuanRD = await YUANRewardDistributor.deployed();
    const yuanETHPool = await YUANETHIncentivizer.deployed();
    const yuanUSDxPool = await YUANUSDxIncentivizer.deployed();
    const eBTCYUANPool = await eBTCYUANIncentivizer.deployed();
    const eBTCRD = await eBTCRewardDistributor.deployed();
    const eETHYUANPool = await eETHYUANIncentivizer.deployed();
    const eETHRD = await eETHRewardDistributor.deployed();

    console.log("Setting distributor:");
    await Promise.all([
      // APY config
      yuanAPY.setYuanAddress(YUANProxy.address),
      yuanAPY.setPoolPath(stableSwapPath),
      yuanAPY.setPoolPath(ethSwapPath),

      // Set RewardDistribution address
      yuanETHPool.setRewardDistribution(YUANRewardDistributor.address),
      yuanUSDxPool.setRewardDistribution(YUANRewardDistributor.address),
      eBTCYUANPool.setRewardDistribution(YUANRewardDistributor.address, eBTCRewardDistributor.address),
      eETHYUANPool.setRewardDistribution(YUANRewardDistributor.address, eETHRewardDistributor.address),
    ]);

    const ONE_YEAR = 60 * 60 * 24 * 365;

    console.log("Transfering and notifying:");
    await Promise.all([
      // incentives is a minter and prepopulates itself.
      yuanRD.addRecipientAndSetReward(
        YUANETHIncentivizer.address,
        ONE_HUNDRED_TWENTY.toString(),
        ONE_YEAR
      ),
      yuanRD.addRecipientAndSetReward(
        YUANUSDxIncentivizer.address,
        TWO_HUNDRED_EIGHTY.toString(),
        ONE_YEAR
      ),
      yuanRD.addRecipientAndSetReward(
        eBTCYUANIncentivizer.address,
        TWO_HUNDRED_EIGHTY.toString(),
        ONE_YEAR
      ),
      yuanRD.addRecipientAndSetReward(
        eETHYUANIncentivizer.address,
        ONE_HUNDRED_TWENTY.toString(),
        ONE_YEAR
      ),
      eBTCRD.addRecipientAndSetReward(
        eBTCYUANIncentivizer.address,
        TWO_HUNDRED_EIGHTY.toString(),
        ONE_YEAR
      ),
      eETHRD.addRecipientAndSetReward(
        eETHYUANIncentivizer.address,
        ONE_HUNDRED_TWENTY.toString(),
        ONE_YEAR
      ),
    ]);

    // Transfer Ownership to Timelock
    await Promise.all([
      yuanETHPool.transferOwnership(Timelock.address),
      yuanUSDxPool.transferOwnership(Timelock.address),
      eBTCYUANPool.transferOwnership(Timelock.address),
      eETHYUANPool.transferOwnership(Timelock.address),
      yuanRD.transferOwnership(Timelock.address),
      eBTCRD.transferOwnership(Timelock.address),
      eETHRD.transferOwnership(Timelock.address),
    ]);

    await YUAN._setIncentivizer(YUANRewardDistributor.address);
    await eBTC._setIncentivizer(eBTCRewardDistributor.address);
    await eETH._setIncentivizer(eETHRewardDistributor.address);
  }

  console.log("Calculate APY is:   ", APY.address);

  console.log("YUAN ETH Pool:      ", YUANETHIncentivizer.address);
  console.log("YUAN USDx Pool:     ", YUANUSDxIncentivizer.address);
  console.log("eBTC YUAN Pool:     ", eBTCYUANIncentivizer.address);
  console.log("eETH YUAN Pool:     ", eETHYUANIncentivizer.address);
  console.log("YUAN Reward Distributor: ", Reward_Distributor.address);
  console.log("eBTC Reward Distributor: ", eBTCRewardDistributor.address);
  console.log("eETH Reward Distributor: ", eETHRewardDistributor.address);
  console.log("\n");
}
