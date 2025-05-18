# MoodNFT - Dynamic AI-Influenced NFTs

## Problem Statement
Traditional NFTs are static digital assets that don't evolve or respond to user interactions. This limitation reduces their utility and engagement potential. In a world where digital assets are becoming increasingly important, there's a need for NFTs that can:
- Adapt and evolve based on user interactions
- Provide dynamic experiences
- Create emotional connections with owners
- Offer more than just static images

---
## Solution
MoodNFT introduces a revolutionary concept where NFTs dynamically change their mood and appearance based on user interactions. Each NFT maintains a mood score that fluctuates based on positive and negative interactions, creating a living, breathing digital asset that responds to its owner's engagement. The system uses smart contracts to track interactions and update the NFT's state on-chain, ensuring transparency and immutability.

---
## Key Features
- **Dynamic Mood System**: NFTs change their mood based on user interactions
- **Real-time Updates**: Instant visual feedback on interactions
- **On-chain Storage**: All interactions and mood changes are recorded on the blockchain
- **Interactive Interface**: User-friendly dashboard for NFT management
- **Responsive Design**: Works seamlessly across all devices
- **Cooldown System**: Prevents spam interactions
- **Inactivity Detection**: Mood changes based on user engagement patterns

---
![Screenshot 2025-05-18 140730](https://github.com/user-attachments/assets/9d6a821b-e775-46c2-ab75-2b799317b815)
![Screenshot 2025-05-18 140759](https://github.com/user-attachments/assets/386c0f53-a243-4c01-b2b2-482cd1ee8067)
![Screenshot 2025-05-18 140833](https://github.com/user-attachments/assets/52776ab8-c1ab-48a3-9739-ab1711d3a318)
![Screenshot 2025-05-18 141357](https://github.com/user-attachments/assets/0716f68d-16a2-4b03-bee3-d116f0aea231)
![Screenshot 2025-05-18 141504](https://github.com/user-attachments/assets/4ca6d5cd-49a9-484a-963b-a4f716cc7fb7)
![Screenshot 2025-05-18 141727](https://github.com/user-attachments/assets/db4d76c2-8caa-4992-8d16-c22df327276e)
![Screenshot 2025-05-18 141026](https://github.com/user-attachments/assets/d47148a5-a7d1-43a4-af34-3188bfeaae54)

---
## Tech Stack
- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: React.js, CSS3
- **Blockchain**: Ethereum (Local Hardhat Network)
- **Web3 Integration**: ethers.js
- **Development Tools**: Node.js, npm
- **Version Control**: Git, GitHub

---
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

---
## AI Oracle Integration
MoodNFT supports a secure, AI-driven dynamic metadata system through a dedicated on-chain oracle mechanism:

- A designated aiOracle address (set during contract deployment) is responsible for updating the NFT’s moodScore based on off-chain AI analysis.
- Only this trusted address can invoke updateMoodFromAI(uint256 tokenId, uint8 newMoodScore), ensuring that external updates are controlled and authenticated.
- On every update, the contract emits a AITraitUpdated(tokenId, newMoodScore) event for traceability.
- The updated mood is stored on-chain and reflected in real time via the NFT's tokenURI, which returns a Base64-encoded JSON metadata string containing the current mood.

This design ensures full transparency, immutability, and secure AI integration without compromising decentralization principles.

---
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

---
## Usage
1. Connect your MetaMask wallet
2. Mint a new MoodNFT
3. Interact with your NFT:
   - Click "Interact" to increase mood score
   - Click "Don't Interact" to decrease mood score
4. Watch your NFT's mood change based on interactions

---
## Future Enhancements
- Integration with IPFS for decentralized image storage
- Additional interaction types
- Social features and NFT trading
- Cross-chain compatibility
- Advanced mood visualization

---
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
## License
This project is licensed under the MIT License - see the LICENSE file for details.

---
## Contact
For any queries or suggestions, please open an issue in the GitHub repository.
