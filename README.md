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

## Contracts

**Mumbai**
- `ManaToken` - [0x882Da5967c435eA5cC6b09150d55E8304B838f45](https://mumbai.polygonscan.com/address/0x882Da5967c435eA5cC6b09150d55E8304B838f45)
- `TownToken` - [0x8bAd6785a7AE644A7F320B5eDcbBB1B5fD02B04D](https://mumbai.polygonscan.com/address/0x8bAd6785a7AE644A7F320B5eDcbBB1B5fD02B04D)
- `AuctionHouse` - [0xfc74Fd6b6EdE56e1Bf2c86a42514522c9f0D60D8](https://mumbai.polygonscan.com/address/0xfc74Fd6b6EdE56e1Bf2c86a42514522c9f0D60D8)
- `ExodusDAO` - [0x5173CfA8d1bbc730BAeB3A9822F3F88Ff18f19d8](https://mumbai.polygonscan.com/address/0x5173CfA8d1bbc730BAeB3A9822F3F88Ff18f19d8)
