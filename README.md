# Exodus Town - Contracts

Within the digital dominion of Exodus Town, these contracts are the bedrock of our economy and governance.

### TownToken

Behold the $TOWN token, an ERC721 artifact that embodies the essence of a parcel in the exodus.town realm. This mystical emblem can only be conjured by the esteemed minter, a role foreordained for the `AuctionHouse` contract.

### AuctionHouse

A monument of code, the `AuctionHouse` is the alchemist behind the minting of `TownToken` parcels. It conducts the daily ritual of auctions, spinning out parcels in an eternal spiral from the world's heart. Settled in the revered $MANA ERC20 tokens, its bounty is entrusted to the `ExodusDAO`, the keeper of wealth and wisdom.

### ExodusDAO

The ExodusDAO stands as an [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/api/governance#governor), a citadel where the `TownToken` holders' will is law. It hoards the treasure from the auctions, awaiting the community's command to channel these riches into realms of possibility. A safeguard is set—a sorcerer's seal that forbids proposal conjuring until 100 $TOWN tokens have emerged, warding off the specter of a 51% assault in the nascent days.

## Tasks

### `deploy`

This sacred incantation deploys the pillars of our society: `TownToken`, `AuctionHouse`, and `ExodusDAO`. It weaves a spell that transfers the ownership of `TownToken` to the `AuctionHouse`, unpauses the `AuctionHouse` to unleash its power to create the genesis auction, and finally it anoints the `ExodusDAO` as the owner and ultimate guardian of the `AuctionHouse`.

### `restart`

This task is akin to turning the page to a new chapter in the epic of Exodus Town. When the sun sets on the current auction and the last bid has been cast, this mystical command ushers in the dawn of a new day. It conjures the next daily auction, ensuring that the spiral of opportunity and adventure within Exodus Town continues unbroken.

### `package`

This rite assembles the npm package, a tome containing both the arcane typings and the ABIs, allowing the magic to be invoked in distant lands. Our CI spirits dutifully craft a `@next` version with every new moon and a `@latest` version with each solar eclipse.

## Contracts

**Mumbai**

- `ManaToken` - [0x882Da5967c435eA5cC6b09150d55E8304B838f45](https://mumbai.polygonscan.com/address/0x882Da5967c435eA5cC6b09150d55E8304B838f45)
- `TownToken` - [0x7a25a3b930D7AAeFA7a3E01DbCCb83311A6854ab](https://mumbai.polygonscan.com/address/0x7a25a3b930D7AAeFA7a3E01DbCCb83311A6854ab)
- `AuctionHouse` - [0x39eF9554d9014d31a5DC8aaDb98EA09896Ca62Af](https://mumbai.polygonscan.com/address/0x39eF9554d9014d31a5DC8aaDb98EA09896Ca62Af)
- `ExodusDAO` - [0x61275A72E1298051487B28cd428c9314fe3E5001](https://mumbai.polygonscan.com/address/0x61275A72E1298051487B28cd428c9314fe3E5001)

**Polygon**

- `ManaToken` - [0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4](https://polygonscan.com/address/0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4)
- `TownToken` - [0xAE38E6d941Fb364c142CC90df285CEEF85713467](https://polygonscan.com/address/0xAE38E6d941Fb364c142CC90df285CEEF85713467)
- `AuctionHouse` - [0x0Ff58e235b154dd7785C4829D48948CE114248C4](https://polygonscan.com/address/0x0Ff58e235b154dd7785C4829D48948CE114248C4)
- `ExodusDAO` - [0x7E96f5242D1256E56E15b46EB2Fa1b1152dF5923](https://polygonscan.com/address/0x7E96f5242D1256E56E15b46EB2Fa1b1152dF5923)
