import { task } from "hardhat/config";

task("deploy", "Deploys and configures all the smart contracts")
  .addOptionalParam("mana", "The address of the MANA token")
  .addOptionalParam(
    "founders",
    "The address that will receive the founders rewards"
  )
  .setAction(async ({ mana, founders }, { ethers }) => {
    const [deployer] = await ethers.getSigners();

    if (!mana) {
      console.log(
        "There was no MANA token address provided, deploying a dummy one..."
      );
      const ERC20 = await ethers.getContractFactory("ERC20");
      const token = await ERC20.deploy("Decentraland", "MANA");
      mana = await token.getAddress();
    }

    if (!founders) {
      console.log(
        "There was no founders address provided, using deployer instead"
      );
      founders = await deployer.getAddress();
    }

    console.log(`Using deployer ${await deployer.getAddress()}`);
    console.log(`Using MANA token ${mana}`);
    console.log(`Using founders ${founders}`);

    const TownToken = await ethers.getContractFactory("TownToken");
    const town = await TownToken.deploy(founders);

    console.log(`TownToken deployed on address ${await town.getAddress()}`);

    const timeBuffer = 300;
    const reservePrice = ethers.parseEther("100");
    const minBidIncrementPercentage = 2;
    const duration = 86400;
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
    const auctionHouse = await AuctionHouse.deploy(
      await town.getAddress(),
      mana,
      timeBuffer,
      reservePrice,
      minBidIncrementPercentage,
      duration
    );

    console.log(
      `AuctionHouse deployed on address ${await auctionHouse.getAddress()}`
    );

    const ExodusDAO = await ethers.getContractFactory("ExodusDAO");
    const exodusDao = await ExodusDAO.deploy(town);

    console.log(
      `ExodusDAO deployed on address ${await exodusDao.getAddress()}`
    );

    const setMinter = await town.setMinter(auctionHouse.getAddress());
    await setMinter.wait();

    console.log(`AuctionHouse has been set as minter of TownToken`);

    const unpause = await auctionHouse.unpause();
    await unpause.wait();

    console.log(`AuctionHouse has been unpaused`);

    const transferOwnership = await auctionHouse.transferOwnership(
      exodusDao.getAddress()
    );
    await transferOwnership.wait();

    console.log(`AuctionHouse ownership has been transferred to ExodusDAO`);

    const renounceOwnership = await town.renounceOwnership();
    await renounceOwnership.wait();

    console.log(`TownToken ownership has been renounced`);
  });
