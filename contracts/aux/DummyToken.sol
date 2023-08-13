// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * The purpose of this contract is only to use as a replacement of the MANA token for local development
 */

contract DummyManaToken is ERC20 {
    constructor() ERC20("DummyManaToken", "DUMMY") {
      _mint(msg.sender, 1000000000000000000000);
    }
}