const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Set up the provider and signer (Hardhat local node)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use one of the default Hardhat private keys (Account #0)
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";  
const wallet = new ethers.Wallet(privateKey, provider);

// MoodNFT contract address and ABI
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const contractABI = [
    "function updateMood(uint256 tokenId, int256 newMood) public",
    "function setOracle(address _oracle) public"
];

// Set the oracle address in the smart contract
async function setOracle() {
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const tx = await contract.setOracle(wallet.address);
    console.log("📡 Oracle address set tx hash:", tx.hash);
    await tx.wait();
    console.log("✅ Oracle address successfully set.");
}

// Fetch mood data from the AI oracle (example using moodnft.json structure)
function fetchMoodData() {
    try {
        const filePath = path.join(__dirname, "moodnft.json");
        const rawData = fs.readFileSync(filePath, "utf-8");
        const moodArray = JSON.parse(rawData);
        return moodArray; // Now expecting an array of objects
    } catch (error) {
        console.error("❌ Failed to read mood data:", error);
        return null;
    }
}

// Update the mood of a specific tokenId with AI predicted mood value
async function updateMood(tokenId) {
    const moodData = fetchMoodData();
    
    if (!moodData) {
        console.error("❌ No mood data available.");
        return;
    }

    const tokenData = moodData.find(item => item.tokenId === tokenId); // Find the data for the specific tokenId

    if (!tokenData || tokenData.mood === undefined) {
        console.error(`❌ No mood data for tokenId ${tokenId}`);
        return;
    }

    const newMood = tokenData.mood;  // Get the mood value for the specified tokenId

    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const tx = await contract.updateMood(tokenId, newMood);
    console.log(`😎 Mood update tx for tokenId ${tokenId}:`, tx.hash);
    await tx.wait();
    console.log("✅ Mood successfully updated.");
}

// Example usage
async function main() {
    await setOracle();              // Run this only once per deployment to set the oracle address
    await updateMood(1);            // tokenId = 1 (example), mood will be fetched from moodnft.json
}

main().catch((err) => console.error("❌ Error in oracle script:", err));
