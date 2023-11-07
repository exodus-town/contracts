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
- `TownToken` - [0x73cddB722f74c19292F7044CBd438785362e76fE](https://mumbai.polygonscan.com/address/0xd04BB262c24f78999111316c3a64eD6eD54acEE9)
- `AuctionHouse` - [0xA49773E011D843200638beBaa5aC8a9B4E73A915](https://mumbai.polygonscan.com/address/0x4d79Ead5046F5aF938F1b335b84168cb3872dD84)
- `ExodusDAO` - [0x4C73F9DE4E6840fd43Bcb53D9aD94553bff2d34b](https://mumbai.polygonscan.com/address/0xe6625504abd43360eA7A1DDe511DdA80757FC071)
