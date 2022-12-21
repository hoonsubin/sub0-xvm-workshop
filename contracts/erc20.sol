// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor () ERC20("Hoon", "HOON") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}