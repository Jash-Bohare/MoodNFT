import React, { useState } from 'react';

const ConnectWallet = ({ setWalletAddress }) => {
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error connecting wallet', error);
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask!');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={isLoading}>
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default ConnectWallet;
