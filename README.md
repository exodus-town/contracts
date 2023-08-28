# Exodus Town - Contracts

### TownToken

The $TOWN token is an ERC721 token (aka "NFT") that represents a parcel in the [exodus.town](https://exodus.town) world. This token can only be minted by the `minter` role, which should be set to be the `AuctionHouse` contract.

### AuctionHouse

This contract is the responsible of minting `TownToken` parcels and auctioning them off (one per day, eternally growing in a spiral from the center of the world). The auctions are settled in an ERC20 token, which should be set to be the $MANA token, and all the proceeds are sent to the `owner` of the contract, which should be set to be the `ExodusDAO`.

### ExodusDAO

This is an [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/api/governance#governor) configured to be governed by the `TownToken` holders. It will receive all the proceeds of the auctions, which then can be put to use by making and passing proposals. It is set to allow creating proposals only after 100 $TOWN tokens have been minted, to prevent 51% attacks while the supply is too low.

## Tasks

### `deploy`

This task deploys the `TownToken`, `AuctionHouse` and `ExodusDAO` contracts, transfers the `TownToken` ownership to the `AuctionHouse`, unpauses the `AuctionHouse` (this creates the first auction), and finally it transfers the ownership of the `AuctionHouse` to the `ExodusDAO`.

### `package`

This task builds the npm package with the typings and the ABIs so they can be used elsewhere. It is used by the CI to publish a `@next` version on every commit and a `@latest` version on every release.

## Contracts

**Mumbai**
- `ManaToken` - [0x882Da5967c435eA5cC6b09150d55E8304B838f45](https://mumbai.polygonscan.com/address/0x882Da5967c435eA5cC6b09150d55E8304B838f45)
- `TownToken` - [0xd04BB262c24f78999111316c3a64eD6eD54acEE9](https://mumbai.polygonscan.com/address/0xd04BB262c24f78999111316c3a64eD6eD54acEE9)
- `AuctionHouse` - [0x4d79Ead5046F5aF938F1b335b84168cb3872dD84](https://mumbai.polygonscan.com/address/0x4d79Ead5046F5aF938F1b335b84168cb3872dD84)
- `ExodusDAO` - [0xe6625504abd43360eA7A1DDe511DdA80757FC071](https://mumbai.polygonscan.com/address/0xe6625504abd43360eA7A1DDe511DdA80757FC071)