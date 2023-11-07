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

### `package`

This rite assembles the npm package, a tome containing both the arcane typings and the ABIs, allowing the magic to be invoked in distant lands. Our CI spirits dutifully craft a `@next` version with every new moon and a `@latest` version with each solar eclipse.

## Contracts

**Mumbai**

- `ManaToken` - [0x882Da5967c435eA5cC6b09150d55E8304B838f45](https://mumbai.polygonscan.com/address/0x882Da5967c435eA5cC6b09150d55E8304B838f45)
- `TownToken` - [0xF11e2D92E12359de0e4A17393CaF01635F3eE6aF](https://mumbai.polygonscan.com/address/0xF11e2D92E12359de0e4A17393CaF01635F3eE6aF)
- `AuctionHouse` - [0xBC6A128fAD5e76af462aC123461EAfD0F9229d88](https://mumbai.polygonscan.com/address/0xBC6A128fAD5e76af462aC123461EAfD0F9229d88)
- `ExodusDAO` - [0x3b0C4AE3AcEB3C45c8cAB1328Ac38879F34f96C0](https://mumbai.polygonscan.com/address/0x3b0C4AE3AcEB3C45c8cAB1328Ac38879F34f96C0)
