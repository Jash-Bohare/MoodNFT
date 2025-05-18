import React, { useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        setError('');
        
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts'
        });
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found");
        }

        const address = accounts[0];
        console.log("Connected account:", address);
        
        // Verify network
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Current chainId:", network.chainId.toString(16));
        
        if (network.chainId !== 31337n) { // Hardhat network ID
          setError("Please switch to the Hardhat network in MetaMask");
          return;
        }
        
        // Call the onConnect callback with the connected address
        if (typeof onConnect !== 'function') {
          console.error("onConnect is not a function:", onConnect);
          throw new Error("Invalid onConnect callback");
        }
        
        console.log("Calling onConnect with address:", address);
        onConnect(address);
        
      } catch (err) {
        console.error("Error connecting wallet:", err);
        if (err.code === -32002) {
          setError("Please check your MetaMask popup and approve the connection request");
        } else if (err.code === 4001) {
          setError("Please connect your wallet to continue");
        } else {
          setError(err.message || "Failed to connect wallet. Please try again");
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError("Please install MetaMask to use this application");
    }
  };

  return (
    <div className="connect-wallet">
      <h2>Connect Your Wallet</h2>
      <p>Connect your MetaMask wallet to start interacting with your MoodNFTs</p>
      <button 
        className="connect-button" 
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ConnectWallet; 