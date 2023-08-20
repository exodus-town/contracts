// SPDX-License-Identifier: GPL-3.0

// LICENSE
// AuctionHouse.sol is a modified version of Nouns DAO's NounsAuctionHouse.sol:
// https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/NounsAuctionHouse.sol
//
// NounsAuctionHouse.sol source code Copyright Nouns DAO licensed under the GPL-3.0 license.

pragma solidity ^0.8.19;

import { Pausable } from '@openzeppelin/contracts/security/Pausable.sol';
import { ReentrancyGuard } from '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { TownToken } from './TownToken.sol';

contract AuctionHouse is
    Pausable,
    ReentrancyGuard,
    Ownable
{
    // The TOWN token contract
    TownToken public town;

    // The MANA token contract
    ERC20 public mana;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The minimum price accepted in an auction
    uint256 public reservePrice;

    // The minimum percentage difference between the last bid amount and the current bid
    uint8 public minBidIncrementPercentage;

    // The duration of a single auction
    uint256 public duration;

    // The active auction
    Auction public auction;

    struct Auction {
        // The token id
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

    event AuctionReset(uint256 indexed tokenId, uint256 startTime, uint256 endTime);

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionMinBidIncrementPercentageUpdated(uint256 minBidIncrementPercentage);

    constructor(
        TownToken _town,
        ERC20 _mana,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint8 _minBidIncrementPercentage,
        uint256 _duration
    ) {
        _pause();

        town = _town;
        mana = _mana;
        timeBuffer = _timeBuffer;
        reservePrice = _reservePrice;
        minBidIncrementPercentage = _minBidIncrementPercentage;
        duration = _duration;
    }

    /**
     * @notice Settle the current auction, mint a new token, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction()
        external
        nonReentrant
        whenNotPaused
    {
        _settleAuction();
        if (auction.settled) {
            _createAuction();
        } else {
            _resetAuction();
        }
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a token, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 _tokenId, uint256 _amount) external nonReentrant {
        Auction memory _auction = auction;

        require(_auction.tokenId == _tokenId, "Token not up for auction");
        require(block.timestamp < _auction.endTime, "Auction expired");
        require(_amount >= reservePrice, "Must bid at least reservePrice");
        require(
            _amount >=
                _auction.amount +
                    ((_auction.amount * minBidIncrementPercentage) / 100),
            "Must send more than last bid by minBidIncrementPercentage amount"
        );
        require(
            mana.balanceOf(msg.sender) >= _amount,
            "Insufficient funds"
        );
        require(
            mana.allowance(msg.sender, address(this)) >= _amount,
            "The auction house is not authorized"
        );

        // transfer mana from bidder to auction house 
        mana.transferFrom(msg.sender, address(this), _amount);

        // Refund the last bidder, if applicable
        address lastBidder = _auction.bidder;
        if (lastBidder != address(0)) {
            mana.transfer(lastBidder, _auction.amount);
        }

        auction.amount = _amount;
        auction.bidder = msg.sender;

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = _auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = _auction.endTime = block.timestamp + timeBuffer;
        }

        emit AuctionBid(_auction.tokenId, msg.sender, _amount, extended);

        if (extended) {
            emit AuctionExtended(_auction.tokenId, _auction.endTime);
        }
    }

    /**
     * @notice Pause the auction house.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the auction house.
     * @dev This function can only be called by the owner when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the owner.
     */
    function setTimeBuffer(uint256 _timeBuffer) external onlyOwner {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(
        uint256 _reservePrice
    ) external onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the owner.
     */
    function setMinBidIncrementPercentage(
        uint8 _minBidIncrementPercentage
    ) external onlyOwner {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(
            _minBidIncrementPercentage
        );
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     */
    function _createAuction() internal {
        uint256 tokenId = town.mint();
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;

        auction = Auction({
            tokenId: tokenId,
            amount: 0,
            startTime: startTime,
            endTime: endTime,
            bidder: address(0),
            settled: false
        });

        emit AuctionCreated(tokenId, startTime, endTime);
    }

    /**
     * @notice Reset auction.
     * @dev Reset the current `auction` state variable and emit an AuctionReset event.
     */
    function _resetAuction() internal {
        uint256 tokenId = auction.tokenId;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;

        auction = Auction({
            tokenId: tokenId,
            amount: 0,
            startTime: startTime,
            endTime: endTime,
            bidder: address(0),
            settled: false
        });

        emit AuctionReset(tokenId, startTime, endTime);
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the owner.
     * @dev If there are no bids, the auction is reset.
     */
    function _settleAuction() internal {
        Auction memory _auction = auction;

        require(_auction.startTime != 0, "Auction hasn't begun");
        require(!_auction.settled, "Auction has already been settled");
        require(
            block.timestamp >= _auction.endTime,
            "Auction hasn't completed"
        );

        // if auction has bids
        if (_auction.bidder != address(0)) {

            // settle auction
            auction.settled = true;

            // transfer token to winner
            town.transferFrom(
                address(this),
                _auction.bidder,
                _auction.tokenId
            );

            // transfer proceeds to owner
            if (_auction.amount > 0) {
                mana.transfer(owner(), _auction.amount);
            }

            // emit event
            emit AuctionSettled(_auction.tokenId, _auction.bidder, _auction.amount);
        }
    }
}