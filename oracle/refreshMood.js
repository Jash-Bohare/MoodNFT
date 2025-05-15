const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load mood data
function fetchMoodData() {
    try {
        const filePath = path.join(__dirname, "MoodNFT.json"); // adjust if different path
        const rawData = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(rawData);
    } catch (error) {
        console.error("❌ Failed to read mood data:", error);
        return null;
    }
}

// Blockchain setup
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
    "function updateMood(uint256 tokenId, int256 newMood) public"
];

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Default Hardhat key
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Main function
const refreshMoods = async () => {
    const moodData = fetchMoodData();

    if (!moodData) {
        console.log("⚠️ No mood data found.");
        return;
    }

    for (const { tokenId, mood } of moodData) {
        try {
            const tx = await contract.updateMood(tokenId, mood);
            await tx.wait();
            console.log(`✅ Mood updated for Token ID ${tokenId}: ${mood}`);
        } catch (err) {
            console.error(`❌ Failed to update Token ID ${tokenId}:`, err.message);
        }
    }
};

refreshMoods();
