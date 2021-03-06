// ============ Contracts ============


// Protocol
const YUANProxy = artifacts.require("YUANDelegator");
const eETHProxy = artifacts.require("eETHDelegator");
const eBTCProxy = artifacts.require("eBTCDelegator");

// deployed third
const YUANReserves = artifacts.require("YUANReservesV2");
const YUANRebaser = artifacts.require("YUANRebaser");
const eETHReserves = artifacts.require("eETHReserves");
const eETHRebaser_C = artifacts.require("eETHRebaser");
const eBTCReserves = artifacts.require("eBTCReserves");
const eBTCRebaser_C = artifacts.require("eBTCRebaser");

// deployed fourth
const Gov = artifacts.require("GovernorAlphaV2");
const Timelock = artifacts.require("Timelock");


// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([
    deployDistribution(deployer),
  ]);
}

module.exports = migration;

// ============ Deploy Functions ============


async function deployDistribution(deployer) {
  const tl = await Timelock.deployed();
  const gov = await Gov.deployed();

  const YUAN = await YUANProxy.deployed();
  const yReserves = await YUANReserves.deployed()
  const yRebaser = await YUANRebaser.deployed()

  const eETH = await eETHProxy.deployed();
  const eETHReserve = await eETHReserves.deployed();
  const eETHRebaser = await eETHRebaser_C.deployed();

  const eBTC = await eBTCProxy.deployed();
  const eBTCReserve = await eBTCReserves.deployed();
  const eBTCRebaser = await eBTCRebaser_C.deployed();


  await Promise.all([
    YUAN._setPendingGov(Timelock.address),
    yReserves._setPendingGov(Timelock.address),
    yRebaser._setPendingGov(Timelock.address),
    eETH._setPendingGov(Timelock.address),
    eETHReserve._setPendingGov(Timelock.address),
    eETHRebaser._setPendingGov(Timelock.address),
    eBTC._setPendingGov(Timelock.address),
    eBTCReserve._setPendingGov(Timelock.address),
    eBTCRebaser._setPendingGov(Timelock.address),
  ]);

  await Promise.all([
      tl.executeTransaction(
        YUANProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        YUANReserves.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),

      tl.executeTransaction(
        YUANRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      // eETH
      tl.executeTransaction(
        eETHProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      tl.executeTransaction(
        eETHReserve.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      tl.executeTransaction(
        eETHRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      // eBTC
      tl.executeTransaction(
        eBTCProxy.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      tl.executeTransaction(
        eBTCReserve.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
      tl.executeTransaction(
        eBTCRebaser.address,
        0,
        "_acceptGov()",
        "0x",
        0
      ),
  ]);
  await tl.setPendingAdmin(Gov.address);
  await gov.__acceptAdmin();
  await gov.__abdicate();
}
