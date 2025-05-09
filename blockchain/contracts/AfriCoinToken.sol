// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title AfriCoinToken
 * @dev Cross-border payment token for African financial transactions
 * Features:
 * - Burnable (to control inflation)
 * - Ownable (for administrative functions)
 * - Permit (for gasless approvals)
 * - Fixed supply with decimal places
 */
contract AfriCoinToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint8 private constant _DECIMALS = 18;
    uint256 private constant _TOTAL_SUPPLY = 100_000_000 * (10 ** _DECIMALS); // 100 million tokens
    
    /**
     * @dev Constructor that mints the total supply to the deployer
     */
    constructor() 
        ERC20("AfriCoin", "AFC") 
        ERC20Permit("AfriCoin")
        Ownable(msg.sender)
    {
        _mint(msg.sender, _TOTAL_SUPPLY);
    }

    /**
     * @dev Returns the number of decimals used
     */
    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /**
     * @dev Mint new tokens (owner only)
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Transfer tokens with additional checks
     * @param to Recipient address
     * @param value Amount to transfer
     */
    function transfer(address to, uint256 value) public override returns (bool) {
        require(to != address(0), "AfriCoin: transfer to zero address");
        return super.transfer(to, value);
    }
}