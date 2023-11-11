import { task } from "hardhat/config";

task(
  "restart",
  "Restarts the daily auction if the previous one is already finished"
)
  .addOptionalParam("address", "The address of the AuctionHouse contract")
  .setAction(async ({ address }, { ethers, network }) => {
    console.log("Restarting daily auction");
    console.log("AuctionHouse:", address);
    console.log("Network:", network.name);
    const auctionHouse = await ethers.getContractAt("AuctionHouse", address);
    const auction = await auctionHouse.auction();
    const endTime = Number(auction.endTime) * 1000;
    const isFinished = endTime < Date.now();
    console.log("Current auction end time:", new Date(endTime));
    console.log("Is auction finished?", isFinished);
    if (isFinished) {
      console.log("Creating new auction...");
      const tx = await auctionHouse.settleCurrentAndCreateNewAuction();
      console.log("Waiting for transaction...");
      await tx.wait();
      console.log("Done!");
    }
  });
