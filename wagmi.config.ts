import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "main.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: ".",
    }),
  ],
});
