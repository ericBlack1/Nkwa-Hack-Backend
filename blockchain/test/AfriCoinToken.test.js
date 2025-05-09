const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AfriCoinToken", function () {
  let AfriCoinToken, token, owner, addr1, addr2;

  const TOTAL_SUPPLY = ethers.parseUnits("100000000", 18); // 100 million
  const DECIMALS = 18;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    AfriCoinToken = await ethers.getContractFactory("AfriCoinToken");
    token = await AfriCoinToken.deploy();
    // Remove the .deployed() call - it's not needed in ethers.js v6
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await token.name()).to.equal("AfriCoin");
      expect(await token.symbol()).to.equal("AFC");
    });

    it("Should set the correct decimals", async function () {
      expect(await token.decimals()).to.equal(DECIMALS);
    });

    it("Should mint the total supply to the owner", async function () {
      expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);

      await token.transfer(addr1.address, transferAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(transferAmount);

      await token.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await token.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const transferAmount = ethers.parseUnits("5000", 18);

      await token.transfer(addr1.address, transferAmount);
      await token.transfer(addr2.address, transferAmount);

      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance - transferAmount - transferAmount
      );

      expect(await token.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await token.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Burn", function () {
    it("Should allow token burning", async function () {
      const burnAmount = ethers.parseUnits("10000", 18);
      const initialSupply = await token.totalSupply();
      const initialBalance = await token.balanceOf(owner.address);

      await token.burn(burnAmount);

      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
      expect(await token.balanceOf(owner.address)).to.equal(
        initialBalance - burnAmount
      );
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("500000", 18);
      const initialSupply = await token.totalSupply();

      await token.mint(addr1.address, mintAmount);

      expect(await token.totalSupply()).to.equal(initialSupply + mintAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should prevent non-owners from minting", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);

      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
