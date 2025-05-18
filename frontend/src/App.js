import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectWallet from './ConnectWallet';
import './App.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function mintNFT(address to) public returns (uint256)",
  "function interact(uint256 tokenId) public",
  "function negativeInteract(uint256 tokenId) public",
  "function checkInactivity(uint256 tokenId) public",
  "function getNFTStats(uint256 tokenId) public view returns (int256, string, uint256, uint256, uint256, uint256, uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function approve(address to, uint256 tokenId) public",
  "function setApprovalForAll(address operator, bool approved) public",
  "function getApproved(uint256 tokenId) public view returns (address)",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event ExperienceGained(uint256 indexed tokenId, uint256 amount, uint256 newTotal)",
  "event LevelUp(uint256 indexed tokenId, uint256 newLevel)",
  "event Interaction(uint256 indexed tokenId, uint256 newInteractionCount)",
  "event ScoreDecreased(uint256 indexed tokenId, int256 newScore)"
];

// Helper to decode base64 and parse JSON from data URI
function decodeTokenURI(tokenURI) {
  try {
    if (!tokenURI) {
      console.log('No tokenURI provided');
      return {
        name: 'MoodNFT',
        description: 'An NFT with AI-influenced mood and interactive features.',
        image: 'https://nft-monkey.com/wp-content/uploads/2023/03/93f114269d5c8a6dacbcf587e4b4c493-1.png'
      };
    }

    if (!tokenURI.startsWith('data:application/json;base64,')) {
      console.log('Invalid tokenURI format:', tokenURI);
      return {
        name: 'MoodNFT',
        description: 'An NFT with AI-influenced mood and interactive features.',
        image: 'https://nft-monkey.com/wp-content/uploads/2023/03/93f114269d5c8a6dacbcf587e4b4c493-1.png'
      };
    }

    const base64 = tokenURI.replace('data:application/json;base64,', '');
    const json = atob(base64);
    const metadata = JSON.parse(json);
    console.log('Decoded metadata:', metadata);
    return metadata;
  } catch (e) {
    console.error('Error decoding tokenURI:', e);
    return {
      name: 'MoodNFT',
      description: 'An NFT with AI-influenced mood and interactive features.',
      image: 'https://nft-monkey.com/wp-content/uploads/2023/03/93f114269d5c8a6dacbcf587e4b4c493-1.png'
    };
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
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [cooldownTimers, setCooldownTimers] = useState({});

  // Add useEffect for cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownTimers(prev => {
        const newTimers = { ...prev };
        let hasChanges = false;

        Object.keys(newTimers).forEach(tokenId => {
          if (newTimers[tokenId] > 0) {
            newTimers[tokenId]--;
            hasChanges = true;
          } else {
            delete newTimers[tokenId];
            hasChanges = true;
          }
        });

        return hasChanges ? newTimers : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update cooldown timer when interacting
  const updateCooldownTimer = (tokenId) => {
    setCooldownTimers(prev => ({
      ...prev,
      [tokenId]: 60 // 60 seconds cooldown
    }));
  };

  // Add useEffect for clearing messages
  useEffect(() => {
    let timer;
    if (refreshMessage) {
      timer = setTimeout(() => {
        setRefreshMessage("");
      }, 3000); // Clear after 3 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [refreshMessage]);

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 3000); // Clear after 3 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    const initProvider = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask");
        }

        // Initialize provider with specific network configuration
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        
        // Get the signer
        const signer = await newProvider.getSigner();
        
        // Initialize contract with signer
        const newContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Test contract connection
        try {
          const name = await newContract.name();
          console.log("Contract name:", name);
        } catch (err) {
          console.error("Error testing contract connection:", err);
          throw new Error("Failed to connect to contract");
        }
        
        setProvider(newProvider);
        setContract(newContract);
        setError('');
        console.log("Provider and contract initialized successfully");
      } catch (err) {
        console.error("Failed to initialize provider:", err);
        setError("Failed to connect to network. Please make sure MetaMask is installed and connected.");
      }
    };

    initProvider();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setWalletAddress('');
          setNfts([]);
        } else {
          setWalletAddress(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  useEffect(() => {
    if (walletAddress && contract && provider) {
      console.log("Wallet connected, fetching NFTs...");
      checkAndMintNFT();
    }
  }, [walletAddress, contract, provider]);

  const checkAndMintNFT = async () => {
    if (!provider || !contract || !walletAddress) {
      console.log("Provider, contract, or wallet address not initialized");
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      console.log("Checking balance for wallet:", walletAddress);
      const balance = await contractWithSigner.balanceOf(walletAddress);
      console.log("Initial balance:", balance.toString());
      
      if (balance.toString() === "0") {
        console.log("No NFTs found, minting new NFT...");
        const tx = await contractWithSigner.mintNFT(walletAddress);
        console.log("Mint transaction sent:", tx.hash);
        await tx.wait();
        console.log("Mint transaction confirmed");
      }
      
      await fetchNFTs();
    } catch (error) {
      console.error("Error checking/minting NFT:", error);
      if (error.message.includes("network")) {
        setError("Please switch to the Hardhat network in MetaMask");
      } else {
        setError("Failed to mint NFT. Please try again.");
      }
    }
  };

  const fetchNFTs = async () => {
    if (!provider || !contract || !walletAddress) {
      console.log("Provider, contract, or wallet address not initialized");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const balance = await contractWithSigner.balanceOf(walletAddress);
      
      if (balance.toString() === "0") {
        setNfts([]);
        setIsLoading(false);
        return;
      }

      const tokens = [];
      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await contractWithSigner.tokenOfOwnerByIndex(walletAddress, i);
          const tokenURI = await contractWithSigner.tokenURI(tokenId);
          const metadata = decodeTokenURI(tokenURI);
          const stats = await contractWithSigner.getNFTStats(tokenId);
          
          tokens.push({ tokenId, tokenURI, metadata, stats });
        } catch (err) {
          console.error(`Error fetching NFT ${i}:`, err);
          continue;
        }
      }

      setNfts(tokens);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      if (error.message.includes("network")) {
        setError("Please switch to the Hardhat network in MetaMask");
      } else {
        setError("Failed to fetch NFTs. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const interactWithNFT = async (tokenId) => {
    if (!provider || !contract || !walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError('');
      setRefreshMessage('');
      setIsLoading(true);

      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      // Check cooldown before sending transaction
      const stats = await contractWithSigner.getNFTStats(tokenId);
      const lastInteractionTime = Number(stats[5]);
      const cooldownTime = 60; // 1 minute for testing
      const timeSinceLastInteraction = Math.floor(Date.now() / 1000) - lastInteractionTime;
      
      if (timeSinceLastInteraction < cooldownTime) {
        const remainingTime = cooldownTime - timeSinceLastInteraction;
        setError(`Please wait ${remainingTime}s before interacting again`);
        return;
      }
      
      const tx = await contractWithSigner.interact(tokenId);
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        updateCooldownTimer(tokenId);
        await fetchNFTs();
        setRefreshMessage("Successfully interacted with your NFT! Mood score increased!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Error interacting with NFT:", err);
      if (err.message.includes("user rejected")) {
        setError("Transaction was rejected");
      } else if (err.message.includes("network")) {
        setError("Please switch to the Hardhat network in MetaMask");
      } else {
        setError("Failed to interact with NFT. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const negativeInteractWithNFT = async (tokenId) => {
    if (!provider || !contract || !walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError('');
      setRefreshMessage('');
      setIsLoading(true);

      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      // Check cooldown before sending transaction
      const stats = await contractWithSigner.getNFTStats(tokenId);
      const lastInteractionTime = Number(stats[5]);
      const cooldownTime = 60; // 1 minute for testing
      const timeSinceLastInteraction = Math.floor(Date.now() / 1000) - lastInteractionTime;
      
      if (timeSinceLastInteraction < cooldownTime) {
        const remainingTime = cooldownTime - timeSinceLastInteraction;
        setError(`Please wait ${remainingTime}s before interacting again`);
        return;
      }
      
      const tx = await contractWithSigner.negativeInteract(tokenId);
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        updateCooldownTimer(tokenId);
        await fetchNFTs();
        setRefreshMessage("Negative interaction recorded. Mood score decreased.");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Error with negative interaction:", err);
      if (err.message.includes("user rejected")) {
        setError("Transaction was rejected");
      } else if (err.message.includes("network")) {
        setError("Please switch to the Hardhat network in MetaMask");
      } else {
        setError("Failed to perform negative interaction. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkInactivity = async () => {
    if (!provider || !contract || !walletAddress) {
      console.log("Provider, contract, or wallet address not initialized");
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      for (const nft of nfts) {
        try {
          const tx = await contractWithSigner.checkInactivity(nft.tokenId);
          await tx.wait();
        } catch (err) {
          console.error(`Error checking inactivity for token ${nft.tokenId}:`, err);
          continue;
        }
      }
      
      // Only refresh if we're still mounted and visible
      if (document.visibilityState === 'visible') {
        await fetchNFTs();
      }
    } catch (err) {
      console.error("Error checking inactivity:", err);
      // Don't set error for inactivity check failures
    }
  };

  const refreshNFTData = async () => {
    if (!provider || !contract || !walletAddress) {
      console.log("Provider, contract, or wallet address not initialized");
      return;
    }

    setRefreshing(true);
    setRefreshMessage("");
    setError("");

    try {
      await fetchNFTs();
      setRefreshMessage("NFT data refreshed successfully!");
    } catch (error) {
      setError("Failed to refresh NFT data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="App">
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="header-content">
            <h1 className="neon-text">MoodNFT</h1>
            <p className="subtitle">AI-Influenced NFT Dashboard</p>
          </div>

          {/* Wallet Info */}
          {!walletAddress ? (
            <button 
              className="connect-button"
              onClick={async () => {
                try {
                  const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                  });
                  setWalletAddress(accounts[0]);
                } catch (error) {
                  console.error('Error connecting wallet:', error);
                }
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <div className="wallet-section">
                <div className="wallet-info">
                  <span>Connected Wallet:</span>
                  <span className="wallet-address">{walletAddress}</span>
                </div>
              </div>
              <button 
                className="exit-button"
                onClick={() => {
                  setWalletAddress('');
                  setNfts([]);
                }}
              >
                Exit Dashboard
              </button>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Messages */}
          <div className="messages-container">
            {error && (
              <div className="message error">
                {error}
              </div>
            )}
            {refreshMessage && (
              <div className="message success">
                {refreshMessage}
              </div>
            )}
          </div>

          {/* NFT Display */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading"></div>
              <span>Loading...</span>
            </div>
          ) : nfts.length > 0 ? (
            <div className="nft-display">
              {nfts.map((nft) => (
                <div key={nft.tokenId.toString()} className="nft-card glass">
                  <div className="nft-header">
                    <h3 className="neon-text">{nft.metadata?.name || `MoodNFT #${nft.tokenId}`}</h3>
                  </div>
                  <div className="nft-content">
                    <div className="nft-image-container">
                      <img src={getImageUrl(nft.metadata?.image)} alt={`NFT #${nft.tokenId}`} className="nft-image" />
                    </div>
                    <div className="nft-stats">
                      <div className="stat-row">
                        <div className="stat-block">
                          <span className="stat-label">Mood Score</span>
                          <span className="stat-value">{nft.stats[0].toString()}</span>
                        </div>
                        <div className="stat-block">
                          <span className="stat-label">Status</span>
                          <span className="stat-value">{nft.stats[1]}</span>
                        </div>
                        <div className="stat-block">
                          <span className="stat-label">Interactions</span>
                          <span className="stat-value">{nft.stats[4].toString()}</span>
                        </div>
                      </div>
                      <div className="interaction-buttons">
                        <button
                          className={`interact-button ${cooldownTimers[nft.tokenId] ? 'disabled' : ''}`}
                          onClick={() => interactWithNFT(nft.tokenId)}
                          disabled={cooldownTimers[nft.tokenId] || isLoading}
                        >
                          {cooldownTimers[nft.tokenId] ? `Cooldown (${cooldownTimers[nft.tokenId]}s)` : 'Interact (+10)'}
                        </button>
                        <button
                          className={`negative-interact-button ${cooldownTimers[nft.tokenId] ? 'disabled' : ''}`}
                          onClick={() => negativeInteractWithNFT(nft.tokenId)}
                          disabled={cooldownTimers[nft.tokenId] || isLoading}
                        >
                          {cooldownTimers[nft.tokenId] ? `Cooldown (${cooldownTimers[nft.tokenId]}s)` : 'Don\'t Interact (-5)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : walletAddress ? (
            <div className="no-nfts">
              <p>You don't own any NFTs yet!</p>
              <p>Connect your wallet to mint your first MoodNFT</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
