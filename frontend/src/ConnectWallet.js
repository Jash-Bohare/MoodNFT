import React from 'react';

function ConnectWallet({ setWalletAddress }) {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="text-center">
      <h2 className="neon-text mb-2">Connect Your Wallet</h2>
      <p className="text-secondary mb-2">Connect your wallet to view and manage your MoodNFTs</p>
      <button className="button" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
}

export default ConnectWallet;
