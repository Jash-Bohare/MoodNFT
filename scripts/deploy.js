const hre = require("hardhat");

async function main() {
  const MoodNFT = await hre.ethers.getContractFactory("MoodNFT");
  const moodNFT = await MoodNFT.deploy();

  await moodNFT.waitForDeployment();

  console.log("MoodNFT deployed to:", await moodNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
