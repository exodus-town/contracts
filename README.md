# Exodus Town - Contracts

### TownToken

This is an ERC721 token (aka "NFT") that represents a parcel in the exodus.town world. This token can only be minted by the `minter` role, which should be set to be the `AuctionHouse` contract.

### AuctionHouse

This contract is the responsible of minting $TOWN tokens and auctioning them off (one per day). The auctions are settled in $MANA and all the proceeds are sent to the `owner` of the contract, which should be set to be the `ExodusDAO`.

### ExodusDAO

This is an [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/api/governance#governor) configured to be governed by the `$TOWN` token holders. It will receive all the proceeds of the auctions, which then can be put to use by making and passing proposals. It is set to allow creating proposals only after 100 $TOWN tokens have been minted, to prevent 51% attacks while the supply is too low.

## Tasks

### `deploy`

This task deploys the `TownToken`, `AuctionHouse` and `ExodusDAO` contracts, set the `TownToken` minter to be the `AuctionHouse`, transfers the ownership of the `AuctionHouse` to the `ExodusDAO` and finally renounces the ownership of the `TownToken`.