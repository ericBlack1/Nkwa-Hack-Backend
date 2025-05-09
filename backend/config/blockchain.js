const { ethers } = require("ethers");
require("dotenv").config();

// Sepolia provider (using your Infura endpoint)
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Operator wallet (for contract interactions)
const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY, provider);

// AfriCoinToken ABI (simplified - add all needed functions)
const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

// Your existing contract instance
const tokenContract = new ethers.Contract(
  "0x6018292AC102aB758ca6C39ddbcf28a356f4467A", // Your verified contract
  ABI,
  wallet
);

module.exports = {
  provider,
  wallet,
  tokenContract,
};
