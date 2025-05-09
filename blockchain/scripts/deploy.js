const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy AfriCoinToken
  const AfriCoinToken = await ethers.getContractFactory("AfriCoinToken");
  const token = await AfriCoinToken.deploy();

  await token.deployed();

  console.log("AfriCoinToken deployed to:", token.address);
  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());
  console.log("Total supply:", (await token.totalSupply()).toString());

  // Verify contract (optional - requires ETHERSCAN_API_KEY in .env)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 5 block confirmations...");
    await token.deployTransaction.wait(5);

    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
