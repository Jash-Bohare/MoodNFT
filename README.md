# MoodNFT

An interactive NFT project where each NFT's mood changes based on user interactions. The NFT's mood score and status are stored on-chain and can be influenced by positive and negative interactions.

## Features

- Mint your own MoodNFT
- Interact with your NFT to increase its mood score (+10)
- Negative interactions decrease the mood score (-5)
- Dynamic mood status based on score:
  - "Very Happy" (score >= 25)
  - "Happy" (score > 0)
  - "Neutral" (score = 0)
  - "Sad" (score < 0)
  - "Very Sad" (score <= -25)
- Cooldown period between interactions (60 seconds)
- One NFT per wallet address

## Tech Stack

- Solidity (Smart Contracts)
- Hardhat (Development Environment)
- React (Frontend)
- ethers.js (Blockchain Interaction)
- MetaMask (Wallet Integration)

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MoodNFT.git
cd MoodNFT
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
```

3. Create a `.env` file in the root directory:
```
REACT_APP_CONTRACT_ADDRESS=your_contract_address
```

## Running Locally

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the frontend:
```bash
cd frontend
npm start
```

4. Configure MetaMask:
   - Network: Localhost 8545
   - Chain ID: 31337
   - Currency Symbol: ETH

## Usage

1. Connect your MetaMask wallet
2. Mint your MoodNFT
3. Use the "Interact" button to increase mood score
4. Use "Don't Interact" button to decrease mood score
5. Wait for the cooldown period between interactions

## Smart Contract

The main contract `MoodNFT.sol` implements:
- ERC721 standard for NFT functionality
- Mood score tracking
- Interaction cooldown system
- Status updates based on mood score

## Frontend

The React frontend provides:
- Wallet connection
- NFT minting interface
- Interaction controls
- Real-time mood status display
- Cooldown timer

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
