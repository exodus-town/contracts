// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TownToken is ERC721, ERC721Enumerable, Ownable, EIP712, ERC721Votes {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address public founders;

    mapping(address => bool) public minters;

    modifier onlyMinter() {
        require(
            _isMinter(),
            "onlyMinter: CALLER_IS_NOT_MINTER"
        );
        _;
    }

    constructor(address _founders) ERC721("Exodus", "TOWN") EIP712("Exodus", "1") {
        founders = _founders;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://realm.exodus.town/token/";
    }

    function _isMinter() internal view returns (bool) {
        return minters[msg.sender];
    }

    function addMinter(address _minter) public onlyOwner {
        minters[_minter] = true;
    }

    function removeMinter(address _minter) public onlyOwner {
        minters[_minter] = false;
    }

    function mint(address to) public onlyMinter returns (uint256) {
        uint256 currentTokenId = _tokenIdCounter.current();
        if (currentTokenId <= 1820 && currentTokenId % 10 == 0) {
            _mintTo(founders);
        }
        return _mintTo(to);
    }

    function _mintTo(address to) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        return tokenId;
    }

    function burn(uint256 nounId) public onlyMinter {
        _burn(nounId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
