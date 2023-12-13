import { task } from "hardhat/config";

task("bid", "Makes a bid on the current auction")
  .addOptionalParam("address", "The address of the AuctionHouse contract")
  .addOptionalParam("token", "The address of the MANA token")
  .addOptionalParam("amount", "The amount of MANA to bid")
  .addOptionalParam("limit", "The maximum amount of MANA to bid")
  .setAction(async ({ address, token, amount, limit }, { ethers, network }) => {
    console.log("AuctionHouse:", address);
    console.log("ManaToken:", token);
    console.log("Network:", network.name);

    const auctionHouse = await ethers.getContractAt("AuctionHouse", address);

    if (!amount) {
      console.log("No amount passed, using reserve price");
    }

    if (limit) {
      console.log(`Bid limit: ${limit} MANA`);
    }

    const reservePrice = await auctionHouse.reservePrice();
    let bid = amount ? ethers.parseEther(amount) : reservePrice;

    const auction = await auctionHouse.auction();
    const endTime = Number(auction.endTime) * 1000;
    const isFinished = endTime < Date.now();
    if (isFinished) {
      console.log("Current auction is finished");
      return;
    } else {
      const minBidIncrementPercentage =
        await auctionHouse.minBidIncrementPercentage();
      const minIncrement = (auction.amount * minBidIncrementPercentage) / 100n;
      const minBid =
        auction.amount === 0n
          ? reservePrice
          : ethers.parseEther(
              Math.ceil(
                Number(ethers.formatEther(auction.amount + minIncrement))
              ).toString()
            );
      console.log(`Minumim bid:`, ethers.formatEther(minBid));
      if (limit) {
        const battleAmount = ethers.parseEther(limit);
        if (minBid <= battleAmount) {
          console.log(`Minimum bid is below bid limit`);
          bid = minBid;
        } else {
          console.log(`Minimum bid is above bid limit`);
        }
      }
      console.log("Bid amount:", ethers.formatEther(bid));
      if (bid < minBid) {
        console.log(
          `Bid is too low, minimum bid is ${ethers.formatEther(minBid)} MANA`
        );
      } else {
        const manaToken = await ethers.getContractAt("ERC20", token);
        const [signer] = await ethers.getSigners();
        const owner = await signer.getAddress();
        let allowance = await manaToken.allowance(owner, address);
        console.log(`Allowance:`, ethers.formatEther(allowance));
        if (allowance > 0n && allowance < bid) {
          console.log(`Resetting allowance...`);
          const tx = await manaToken.approve(address, 0n);
          await tx.wait();
          console.log(`Done!`);
          allowance = await manaToken.allowance(owner, address);
        }
        if (allowance === 0n) {
          console.log(`Setting allowance to: ${ethers.formatEther(bid)}...`);
          const tx = await manaToken.approve(address, bid);
          await tx.wait();
          console.log(`Done!`);
        }
        console.log(`Making bid of ${ethers.formatEther(bid)}...`);
        const tx = await auctionHouse.createBid(auction.tokenId, bid);
        await tx.wait();
        console.log(`Done!`);
      }
    }
  });
