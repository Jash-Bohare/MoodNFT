import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './ConnectWallet';
import './App.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

// Helper to decode base64 and parse JSON from data URI
function decodeTokenURI(tokenURI) {
  try {
    if (!tokenURI.startsWith('data:application/json;base64,')) {
      console.log('Invalid tokenURI format:', tokenURI);
      return null;
    }
    const base64 = tokenURI.replace('data:application/json;base64,', '');
    const json = atob(base64);
    const metadata = JSON.parse(json);
    console.log('Decoded metadata:', metadata);
    return metadata;
  } catch (e) {
    console.error('Error decoding tokenURI:', e);
    return null;
  }
}

// Helper to convert IPFS URI to HTTP URL
function getImageUrl(ipfsUrl) {
  return 'https://nft-monkey.com/wp-content/uploads/2023/03/93f114269d5c8a6dacbcf587e4b4c493-1.png';
}

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
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        const balance = await contract.balanceOf(walletAddress);
        console.log("NFT Balance:", balance.toString());
        const tokens = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
          console.log("Token ID:", tokenId.toString());
          const tokenURI = await contract.tokenURI(tokenId);
          console.log("Token URI:", tokenURI);
          const metadata = decodeTokenURI(tokenURI);
          console.log("Decoded Metadata:", metadata);
          tokens.push({ tokenId, tokenURI, metadata });
        }

        console.log("Final tokens array:", tokens);
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
      <header className="App-header">
        <h1 className="neon-text">MoodNFT</h1>
        <p className="text-secondary">Your Dynamic Mood NFT Collection</p>
      </header>

      {walletAddress ? (
        <div className="card glass">
          <div className="flex mb-2">
            <p className="text-secondary">Connected Wallet:</p>
            <p className="wallet-address">{walletAddress}</p>
          </div>

          {isLoading ? (
            <div className="flex">
              <div className="loading"></div>
              <p>Loading your NFTs...</p>
            </div>
          ) : (
            <div className="nft-container">
              {nfts && nfts.length > 0 ? (
                nfts.map((nft, index) => {
                  console.log('Rendering NFT:', nft);
                  const imageUrl = getImageUrl(nft.metadata?.image);
                  console.log('Image URL for NFT:', imageUrl);
                  return (
                    <div key={index} className="nft-card glass">
                      <div style={{ 
                        width: '100%', 
                        height: '300px', 
                        background: 'linear-gradient(45deg, rgba(0, 242, 255, 0.1), rgba(255, 0, 255, 0.1))',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={imageUrl}
                          alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="nft-info">
                        <h2 className="nft-title">{nft.metadata?.name || `NFT #${nft.tokenId}`}</h2>
                        <p className="nft-description">
                          {nft.metadata?.description || "A unique Mood NFT"}
                        </p>
                        
                        <div className="status-badges">
                          <div className="status-badge">
                            Mood Score: {nft.metadata?.attributes?.find(attr => attr.trait_type === 'Mood Score')?.value || 'N/A'}
                          </div>
                          <div className="status-badge">
                            Status: {nft.metadata?.attributes?.find(attr => attr.trait_type === 'Mood Status')?.value || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="card glass text-center">
                  <p className="neon-text">You don't own any NFTs yet!</p>
                  <p className="text-secondary mt-1">Connect your wallet and mint your first MoodNFT</p>
                </div>
              )}
            </div>
          )}

          <div className="flex mt-2">
            <button 
              className="button" 
              onClick={refreshMood} 
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Mood"}
            </button>
          </div>

          {refreshMessage && (
            <div className={`card glass mt-2 ${refreshMessage.includes("❌") ? "error" : "success"}`}>
              <p>{refreshMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card glass">
          <ConnectWallet setWalletAddress={setWalletAddress} />
        </div>
      )}
    </div>
  );
}

export default App;
