// SPDX-License-Identifier: GPL-3.0

// LICENSE
// IExodusAuctionHouse.sol is a modified version of Nouns DAO's INounsAuctionHouse.sol:
// https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/interfaces/INounsAuctionHouse.sol
//
// INounsAuctionHouse.sol source code Copyright Nouns DAO licensed under the GPL-3.0 license.

pragma solidity ^0.8.6;

interface IAuctionHouse {
    struct Auction {
        // ERC721 token id
        uint256 tokenId;
        // The current highest bid amount
        uint256 amount;
        // The time that the auction started
        uint256 startTime;
        // The time that the auction is scheduled to end
        uint256 endTime;
        // The address of the current highest bid
        address bidder;
        // Whether or not the auction has been settled
        bool settled;
    }

    event AuctionCreated(uint256 indexed tokenId, uint256 startTime, uint256 endTime);

    event AuctionBid(uint256 indexed tokenId, address sender, uint256 value, bool extended);

    event AuctionExtended(uint256 indexed tokenId, uint256 endTime);

    event AuctionSettled(uint256 indexed tokenId, address winner, uint256 amount);

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionMinBidIncrementPercentageUpdated(uint256 minBidIncrementPercentage);

    function settleAuction() external;

    function settleCurrentAndCreateNewAuction() external;

    function createBid(uint256 tokenId, uint256 amount) external;

    function pause() external;

    function unpause() external;

    function setTimeBuffer(uint256 timeBuffer) external;

    function setReservePrice(uint256 reservePrice) external;

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage) external;
}