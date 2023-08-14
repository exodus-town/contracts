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
        "There was no MANA token address provided, a dummy one will be deployed and used instead"
      );

      console.log("Deploying DummyManaToken...");
      const DummyManaToken = await ethers.getContractFactory("DummyManaToken");
      const dummy = await DummyManaToken.deploy();
      await dummy.waitForDeployment();
      console.log(
        `DummyManaToken deployed on address ${await dummy.getAddress()}`
      );

      mana = await dummy.getAddress();
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

    console.log("Deploying TownToken...");
    const TownToken = await ethers.getContractFactory("TownToken");
    const town = await TownToken.deploy(founders);
    await town.waitForDeployment();

    console.log(`TownToken deployed on address ${await town.getAddress()}`);


    console.log("Deploying AuctionHouse...");
    const timeBuffer = 300;
    const reservePrice = ethers.parseEther("100");
    const minBidIncrementPercentage = 2;
    const duration = 86400;
    console.log("timeBuffer", timeBuffer);
    console.log("reservePrice", reservePrice);
    console.log("minBidIncrementPercentage", minBidIncrementPercentage);
    console.log("duration", duration);
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
    const auctionHouse = await AuctionHouse.deploy(
      await town.getAddress(),
      mana,
      timeBuffer,
      reservePrice,
      minBidIncrementPercentage,
      duration
    );
    await auctionHouse.waitForDeployment();
    console.log(
      `AuctionHouse deployed on address ${await auctionHouse.getAddress()}`
    );

    console.log("Deploying ExodusDAO...");
    const ExodusDAO = await ethers.getContractFactory("ExodusDAO");
    const exodusDao = await ExodusDAO.deploy(town);
    await exodusDao.waitForDeployment();
    console.log(
      `ExodusDAO deployed on address ${await exodusDao.getAddress()}`
    );

    console.log("Transferring TownToken ownership...");
    const transferTownTokenOwnership = await town.transferOwnership(
      auctionHouse.getAddress()
    );
    await transferTownTokenOwnership.wait();
    console.log(`TownToken ownership has been transferred to AuctionHouse`);

    console.log("Unpausing AuctionHouse...");
    const unpause = await auctionHouse.unpause();
    await unpause.wait();
    console.log(`AuctionHouse has been unpaused`);

    console.log("Transferring AuctionHouse...");
    const transferAuctionHouseOwnership = await auctionHouse.transferOwnership(
      exodusDao.getAddress()
    );
    await transferAuctionHouseOwnership.wait();
    console.log(`AuctionHouse ownership has been transferred to ExodusDAO`);
  });
