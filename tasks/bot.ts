import { task } from "hardhat/config";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

task("bot", "Keeps bidding for a certain amount of time")
  .addOptionalParam("address", "The address of the AuctionHouse contract")
  .addOptionalParam("token", "The address of the MANA token")
  .addOptionalParam("amount", "The amount of MANA to bid")
  .addOptionalParam("limit", "The maximum amount of MANA to bid")
  .addOptionalParam("interval", "The interval in seconds to poll")
  .addOptionalParam("duration", "The total time the bot will be running")
  .addOptionalParam("random", "Adds a random amount to the bid limit")
  .setAction(
    async (
      { address, token, amount, limit, interval, duration, random },
      { run }
    ) => {
      const INTERVAL = interval ? interval * 1000 : 30_000;
      const DURATION = duration ? duration * 1000 : null;
      console.log(`Polling interval: ${(INTERVAL / 1000) | 0} seconds`);
      if (DURATION) {
        console.log(`Duration: ${(DURATION / 1000) | 0} seconds`);
      }
      let elapsed = 0;
      const startTime = Date.now();

      if (random) {
        if (limit) {
          const randomExtra = (Math.random() * Number(random)) | 0;
          console.log(`Adding random amount to bid limit: ${randomExtra}`);
          limit = (Number(limit) + randomExtra).toString();
        } else {
          console.log(`You can't the random option without a limit`);
        }
      }

      while (!DURATION || elapsed < DURATION) {
        try {
          await run("bid", { address, token, amount, limit });
        } finally {
          console.log(`Sleeping for ${(INTERVAL / 1000) | 0} seconds`);
          await sleep(INTERVAL);
          elapsed = Date.now() - startTime;
        }
        if (DURATION) {
          const timeLeft = DURATION - elapsed;
          if (timeLeft > 0) {
            console.log(
              `Time left to run the bot: ${(timeLeft / 1000) | 0} seconds`
            );
          } else {
            console.log(
              `Duration exceeded limit of ${(DURATION / 1000) | 0} seconds`
            );
          }
        }
      }

      console.log(`Exiting...`);
    }
  );
