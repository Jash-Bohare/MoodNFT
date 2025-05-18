# MoodNFT - Dynamic AI-Influenced NFTs

## Problem Statement
Traditional NFTs are static digital assets that don't evolve or respond to user interactions. This limitation reduces their utility and engagement potential. In a world where digital assets are becoming increasingly important, there's a need for NFTs that can:
- Adapt and evolve based on user interactions
- Provide dynamic experiences
- Create emotional connections with owners
- Offer more than just static images

## Solution
MoodNFT introduces a revolutionary concept where NFTs dynamically change their mood and appearance based on user interactions. Each NFT maintains a mood score that fluctuates based on positive and negative interactions, creating a living, breathing digital asset that responds to its owner's engagement. The system uses smart contracts to track interactions and update the NFT's state on-chain, ensuring transparency and immutability.

## Key Features
- **Dynamic Mood System**: NFTs change their mood based on user interactions
- **Real-time Updates**: Instant visual feedback on interactions
- **On-chain Storage**: All interactions and mood changes are recorded on the blockchain
- **Interactive Interface**: User-friendly dashboard for NFT management
- **Responsive Design**: Works seamlessly across all devices
- **Cooldown System**: Prevents spam interactions
- **Inactivity Detection**: Mood changes based on user engagement patterns

## Tech Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js, CSS3
- **Blockchain**: Ethereum (Local Hardhat Network)
- **Web3 Integration**: ethers.js
- **Development Tools**: Node.js, npm
- **Version Control**: Git, GitHub

## Architecture
The system consists of three main components:

1. **Smart Contract Layer**
   - MoodNFT.sol: Manages NFT creation and mood updates
   - Handles interaction logic and score calculations
   - Stores all NFT data on-chain

2. **Frontend Layer**
   - React-based dashboard
   - Real-time interaction interface
   - Responsive design for all devices
   - Web3 integration for blockchain interaction

3. **Interaction Flow**
   ```
   User Action → Frontend → Smart Contract → State Update → UI Update
   ```

## Installation & Setup
1. Clone the repository
   ```bash
   git clone https://github.com/Jash-Bohare/MoodNFT.git
   cd MoodNFT
   ```

2. Install dependencies
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Start local Hardhat node
   ```bash
   npx hardhat node
   ```

4. Deploy contract
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Start frontend
   ```bash
   cd frontend
   npm start
   ```

## Usage
1. Connect your MetaMask wallet
2. Mint a new MoodNFT
3. Interact with your NFT:
   - Click "Interact" to increase mood score
   - Click "Don't Interact" to decrease mood score
4. Watch your NFT's mood change based on interactions

## Future Enhancements
- Integration with IPFS for decentralized image storage
- Additional interaction types
- Social features and NFT trading
- Cross-chain compatibility
- Advanced mood visualization

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any queries or suggestions, please open an issue in the GitHub repository.
