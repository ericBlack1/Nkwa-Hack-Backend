const { tokenContract } = require("../config/blockchain");

class BlockchainService {
  // Get token metadata
  async getTokenInfo() {
    return {
      name: await tokenContract.name(),
      symbol: await tokenContract.symbol(),
      decimals: await tokenContract.decimals(),
      totalSupply: (await tokenContract.totalSupply()).toString(),
    };
  }

  // Get user balance
  async getBalance(address) {
    return (await tokenContract.balanceOf(address)).toString();
  }

  // Transfer tokens
  async transfer(fromAddress, toAddress, amount) {
    const amountWei = ethers.parseUnits(amount.toString(), 18);

    // Estimate gas
    const gasEstimate = await tokenContract.transfer.estimateGas(
      toAddress,
      amountWei,
      { from: fromAddress }
    );

    // Execute transfer with 10% gas buffer
    const tx = await tokenContract.transfer(toAddress, amountWei, {
      from: fromAddress,
      gasLimit: (gasEstimate * 110n) / 100n,
    });

    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? "success" : "failed",
    };
  }

  // Mint new tokens (owner only)
  async mint(toAddress, amount) {
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    const tx = await tokenContract.mint(toAddress, amountWei);
    await tx.wait();
    return tx.hash;
  }

  // Listen for transfer events
  async listenForTransfers(callback) {
    tokenContract.on("Transfer", (from, to, value, event) => {
      callback({
        from,
        to,
        value: value.toString(),
        txHash: event.transactionHash,
      });
    });
  }
}

module.exports = new BlockchainService();
