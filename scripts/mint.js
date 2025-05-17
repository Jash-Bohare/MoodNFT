const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const MoodNFT = await hre.ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.attach(contractAddress).connect(deployer);

  // 👇 Set recipient to your MetaMask wallet
  const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

  console.log(`Minting NFT to address: ${recipient}`);
  const tx = await moodNFT.mintNFT(recipient);
  const receipt = await tx.wait();

  console.log("✅ NFT confirmed in block:", receipt.blockNumber);
  console.log("📦 Transaction Hash:", tx.hash);
}

main().catch((error) => {
  console.error("❌ Error in script:", error);
  process.exitCode = 1;
});
