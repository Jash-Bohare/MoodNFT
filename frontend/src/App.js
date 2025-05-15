import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './ConnectWallet';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");

  useEffect(() => {
    if (walletAddress) {
      fetchNFTs();
    }
  }, [walletAddress]);

  const fetchNFTs = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Local Ethereum node or use Infura for live networks
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        const balance = await contract.balanceOf(walletAddress);
        const tokens = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
          const tokenURI = await contract.tokenURI(tokenId);
          
          tokens.push({ tokenId, tokenURI });
        }

        setNfts(tokens);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
      setIsLoading(false);
    }
  };

  const refreshMood = async () => {
    setRefreshing(true);
    setRefreshMessage("");

    try {
        const response = await fetch("/api/refresh-mood", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error("Failed to refresh moods.");
        }

        const data = await response.json();
        setRefreshMessage(data.message || "Mood refreshed successfully!");
    } catch (error) {
        setRefreshMessage(`❌ Error: ${error.message}`);
    } finally {
        setRefreshing(false);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to MoodNFT</h1>
      {walletAddress ? (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          {isLoading ? (
            <p>Loading NFTs...</p>
          ) : (
            <div>
              <h2>Your NFTs:</h2>
              <ul>
                {nfts.length > 0 ? (
                  nfts.map((nft, index) => (
                    <li key={index}>
                      <p>Token ID: {nft.tokenId}</p>
                      <p>Token URI: {nft.tokenURI}</p>
                    </li>
                  ))
                ) : (
                  <p>You don't own any NFTs!</p>
                )}
              </ul>
            </div>
          )}
          <button onClick={refreshMood} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh Mood"}
          </button>
          {refreshMessage && <p>{refreshMessage}</p>}
        </div>
      ) : (
        <ConnectWallet setWalletAddress={setWalletAddress} />
      )}
    </div>
  );
}

export default App;
