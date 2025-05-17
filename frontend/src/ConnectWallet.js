import React from 'react';

const ConnectWallet = ({ setWalletAddress }) => {
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log("Connected account:", account);

      // Check if we're on the right network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("Current chainId:", chainId);

      if (chainId !== '0x7a69') { // Hardhat network
        try {
          // Try to switch to Hardhat network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7a69' }],
          });
        } catch (switchError) {
          // If the network is not added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7a69',
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      setWalletAddress(account);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(error.message);
    }
  };

  return (
    <div className="connect-wallet">
      <button onClick={connectWallet} className="connect-button">
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
