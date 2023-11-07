import { task } from "hardhat/config";

task("deploy", "Deploys and configures all the smart contracts")
  .addOptionalParam("mana", "The address of the MANA token")
  .addOptionalParam(
    "threshold",
    "The minimum supply for governance to be enabled"
  )
  .setAction(async ({ mana, threshold }, { ethers, network }) => {
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

    if (!threshold) {
      console.log("There was no minSupply provided, using default value of 3");
      threshold = 3;
    }

    console.log(`Using deployer ${await deployer.getAddress()}`);
    console.log(`Using MANA token ${mana}`);

    console.log("Deploying TownToken...");
    const TownToken = await ethers.getContractFactory("TownToken");
    const town = await TownToken.deploy();
    await town.waitForDeployment();

    console.log(`TownToken deployed on address ${await town.getAddress()}`);

    console.log("Deploying AuctionHouse...");
    const timeBuffer = 300;
    const reservePrice = ethers.parseEther("10");
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
    console.log(`Proposals disabled until totalSupply >= ${threshold}`);
    const ExodusDAO = await ethers.getContractFactory("ExodusDAO");
    const dao = await ExodusDAO.deploy(town, threshold);
    await dao.waitForDeployment();
    console.log(`ExodusDAO deployed on address ${await dao.getAddress()}`);

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
      dao.getAddress()
    );
    await transferAuctionHouseOwnership.wait();
    console.log(`AuctionHouse ownership has been transferred to ExodusDAO`);

    console.log(`\nContract Addresses:
    
    - TownToken: ${await town.getAddress()}

    - AuctionHouse: ${await auctionHouse.getAddress()}

    - ExodusDAO: ${await dao.getAddress()}
    `);

    if (network.name !== "localhost") {
      const verify = `npx hardhat verify --network ${network.name}`;
      console.log(`\nVerify Contracts:

${verify} ${await town.getAddress()} && ${verify} ${await auctionHouse.getAddress()} ${await town.getAddress()} ${mana} ${timeBuffer} ${reservePrice} ${minBidIncrementPercentage} ${duration} && ${verify} ${await dao.getAddress()} ${await town.getAddress()} ${threshold}`);
    }
  });
