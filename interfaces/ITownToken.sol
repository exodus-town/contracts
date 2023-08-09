// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IERC721Enumerable } from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';

interface ITownToken is IERC721, IERC721Enumerable { 
  function mint() external returns (uint256);
  function addMinter(address minter) external;
  function removeMinter(address minter) external;
  function burn(uint256 tokenId) external;
}