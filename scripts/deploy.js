const hre = require("hardhat");

async function main() {
  const MoodNFT = await hre.ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.deploy();

  await moodNFT.waitForDeployment(); 

  const deployedAddress = await moodNFT.getAddress();

  console.log(`✅ MoodNFT deployed to: ${deployedAddress}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
