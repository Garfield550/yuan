const { ONE_HUNDRED_TWENTY, TWO_HUNDRED_EIGHTY } = require('./constants');

// ============ Contracts ============


// Protocol
// deployed helper
const APY = artifacts.require("CalculateApy");
// deployed second
const YUANProxy = artifacts.require("YUANDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");
const Timelock = artifacts.require("Timelock");

// deployed fifth
// const YUAN_ETHIncentivizer = artifacts.require("YUANETHIncentivizer");
// const YUAN_USDxIncentivizer = artifacts.require("YUANUSDxIncentivizer");
const Reward_Distributor = artifacts.require("RewardDistributor");
const eBTCYUANIncentivizer = artifacts.require("eBTCYUANIncentivizer");
const eBTCRewardDistributor = artifacts.require("eBTCRewardDistributor");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  // await Promise.all([
  //   deployDistribution(deployer, network, accounts),
  // ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer, network, accounts) {
  console.log('YUAN address:  ', YUANProxy.address);
  console.log('eBTC address:  ', eBTCProxy.address);
  // console.log('eETH address:  ', eETHProxy.address);

  // const TL = await Timelock.deployed();
  // const YUAN = await YUANProxy.deployed();
  const eBTC = await eBTCProxy.deployed();

  if (network != "test") {
    // deploy apy contract
    // await deployer.deploy(APY, YUAN.address);

    // await deployer.deploy(YUAN_ETHIncentivizer, YUAN.address);
    // await deployer.deploy(YUAN_USDxIncentivizer, YUAN.address);
    // await deployer.deploy(Reward_Distributor, YUAN.address);

    // Deploy eBTCRewardDistributor and eBTCYUANIncentivizer contract
    await deployer.deploy(eBTCRewardDistributor, eBTCProxy.address);
    await deployer.deploy(eBTCYUANIncentivizer, YUANProxy.address, eBTCProxy.address);

    // const yuanApy = new web3.eth.Contract(APY.abi, APY.address);
    // const reserveToken = "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549";
    // const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    // set swap route
    // const stableSwapPath = [YUAN.address, reserveToken];
    // const ethSwapPath = [weth, reserveToken];

    const incentive_distribution = await Reward_Distributor.deployed();
    // const yaun_eth_pool = new web3.eth.Contract(YUAN_ETHIncentivizer.abi, YUAN_ETHIncentivizer.address);
    // const yaun_usdx_pool = new web3.eth.Contract(YUAN_USDxIncentivizer.abi, YUAN_USDxIncentivizer.address);
    const eBTCYUANPool = await eBTCYUANIncentivizer.deployed();
    const eBTCRD = await eBTCRewardDistributor.deployed();

    console.log("Setting distributor:");
    await Promise.all([
      // APY config
      // yuanApy.methods.setYuanAddress(YUAN.address).send({ from: accounts[0]}),
      // yuanApy.methods.setPoolPath(stableSwapPath).send({ from: accounts[0]}),
      // yuanApy.methods.setPoolPath(ethSwapPath).send({ from: accounts[0]}),

      // Set RewardDistribution address
      // yaun_eth_pool.methods.setRewardDistribution(Reward_Distributor.address).send({ from: accounts[0], gas: 100000}),
      // yaun_usdx_pool.methods.setRewardDistribution(Reward_Distributor.address).send({from: accounts[0], gas: 100000}),
      // eBTCYUANPool.setRewardDistribution(Reward_Distributor.address, eBTCRewardDistributor.address)
      eBTCYUANPool.setRewardDistribution(Reward_Distributor.address, eBTCRewardDistributor.address)
    ]);

    const ONE_YEAR = 60 * 60 * 24 * 365;

    console.log("Transfering and notifying");

    await Promise.all([
      // incentives is a minter and prepopulates itself.
      // incentive_distribution.methods.addRecipientAndSetReward(
      //   YUAN_ETHIncentivizer.address,
      //   ONE_HUNDRED_TWENTY.toString(),
      //   ONE_YEAR
      // ).send({ from: accounts[0]}),
      // incentive_distribution.methods.addRecipientAndSetReward(
      //   YUAN_USDxIncentivizer.address,
      //   TWO_HUNDRED_EIGHTY.toString(),
      //   ONE_YEAR
      // ).send({ from: accounts[0]}),
      // incentive_distribution.addRecipientAndSetReward(
      //   eBTCYUANIncentivizer.address,
      //   TWO_HUNDRED_EIGHTY.toString(),
      //   ONE_YEAR
      // ),
      eBTCRD.addRecipientAndSetReward(
        eBTCYUANIncentivizer.address,
        TWO_HUNDRED_EIGHTY.toString(),
        ONE_YEAR
      )
    ]);

    // Transfer Ownership to Timelock
    await Promise.all([
      // yaun_eth_pool.methods.transferOwnership(Timelock.address).send({ from: accounts[0], gas: 100000 }),
      // yaun_usdx_pool.methods.transferOwnership(Timelock.address).send({ from: accounts[0], gas: 100000 }),
      // incentive_distribution.methods.transferOwnership(Timelock.address).send({ from: accounts[0], gas: 100000 }),
    ]);

    // await YUAN._setIncentivizer(Reward_Distributor.address);
    await eBTC._setIncentivizer(eBTCRewardDistributor.address);
  }

  // console.log("Calculate APY is:   ", APY.address,"\n")

  // console.log("YUAN ETH Pool:      ", YUAN_ETHIncentivizer.address);
  // console.log("YUAN USDx Pool:     ", YUAN_USDxIncentivizer.address);
  console.log("eBTC YUAN Pool:     ", eBTCYUANIncentivizer.address);
  console.log("YUAN Reward Distributor: ", Reward_Distributor.address);
  console.log("eBTC Reward Distributor: ", eBTCRewardDistributor.address, "\n")
}
