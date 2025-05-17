# **MoodNFT**

> Empowering NFTs with Dynamic Metadata Controlled by AI

---

## **Problem Statement**

### What Problem We Are Solving?

Current NFTs are static digital assets, meaning their properties, like metadata and visual characteristics, remain unchanged after minting. This limits the possibilities for interaction and user engagement. NFTs are essentially "one-time" creations, and once they are minted, their state cannot evolve based on the user’s behavior or external factors like AI-driven analysis.

### Why is This Problem Important or Urgent?

As NFTs grow in popularity, creators and collectors are looking for ways to enhance the experience of owning these digital assets. Static NFTs fail to reflect the evolving nature of the digital world. If NFTs could change over time, based on factors like user interaction or AI models, it could create deeper engagement, make NFTs more meaningful, and introduce new use cases in gaming, art, and collectibles.

---

## **Solution / What It Does**

This project introduces **MoodNFT**—ERC721 tokens that have metadata (like mood, power level, or status) that can change over time based on user interaction or external AI signals. The **AI oracle** plays a key role, providing off-chain data that updates the NFT’s attributes. The changes are then reflected on-chain and can be viewed through the NFT’s dynamic metadata.

Whenever a user interacts with the NFT in specific ways (positive or negative), the AI system evaluates the interaction and updates the NFT's attributes like `moodScore`, `statusLevel`, etc. This makes NFTs more interactive and engaging, as they can evolve based on real-time conditions.

---

## **Key Features**

* **Dynamic Metadata**: NFTs that change attributes (e.g., mood, status) over time based on user interaction.
* **AI Integration**: Off-chain AI oracle sends updates to the NFT contract to change its attributes based on predefined logic (positive or negative actions).
* **ERC721 Compliance**: Fully compliant with ERC721 standards, ensuring broad compatibility and ease of use.
* **On-Chain Updates**: NFT attributes are stored on-chain, ensuring transparency and immutability.
* **Oracle-Driven Changes**: Only authorized oracles (AI services) can modify the NFT's attributes to prevent unauthorized changes.
* **Token URI**: The `tokenURI` function returns dynamic JSON metadata, reflecting the current state of the NFT.
* **Event Emission**: Smart contract emits events when an NFT’s attribute is updated, allowing users to track changes.

---

## **Tech Stack**

* **Blockchain & Smart Contract**: Ethereum (ERC721), Solidity
* **Oracle Integration**: Off-chain AI system (Python, TensorFlow, or any AI service), Web3.js or ethers.js for smart contract interaction
* **Storage**: IPFS (for static image hosting or metadata storage)
* **Front-End (optional)**: React.js or any front-end framework to display the NFTs and their changing attributes
* **Development Environment**: Hardhat/Truffle for smart contract development and testing, Ganache for local testing

---

## **Architecture / System Design**

### Summary:

The system consists of two main parts:

1. **NFT Smart Contract**: The ERC721 contract where each NFT can have mutable attributes. The contract includes the `tokenURI` function to serve dynamic metadata based on user interaction and AI input.
2. **AI Oracle**: An off-chain AI service that evaluates user interactions with NFTs and updates the NFT's attributes. The oracle communicates with the smart contract to update the attributes (e.g., `moodScore`).
3. **User Interaction**: A user interacts with the NFT (for example, using a web application), and based on those actions, the oracle decides whether the interaction is positive or negative, then updates the attributes accordingly.

*Note: A diagram illustrating the flow of data between the smart contract, oracle, and user interactions will be added in the docs section.*

---

## **Roadmap**

### **Phase 1: Conceptualization & Planning (0-6 Hours)**

* Define core NFT attributes (e.g., moodScore, status).
* Set up the structure for the smart contract (ERC721).

### **Phase 2: Smart Contract Development (6-12 Hours)**

* Implement the ERC721 contract with dynamic attributes.
* Set up `tokenURI` to return dynamic metadata.
* Develop an access control system for the oracle to update the NFT.

### **Phase 3: AI Oracle Integration (12-24 Hours)**

* Build or integrate an off-chain AI model that can evaluate user actions (positive/negative).
* Set up the oracle service to interact with the smart contract and update the NFT's attributes.
* Test the interaction between the oracle and the smart contract.

### **Phase 4: Front-End Development (Optional, 12-24 Hours)**

* Create a simple UI to showcase the NFT’s attributes.
* Integrate the smart contract into a front-end app (React.js or similar).

### **Phase 5: Testing & Deployment (24-30 Hours)**

* Test the smart contract on a local Ethereum testnet (e.g., Ganache).
* Deploy to a public testnet (e.g., Rinkeby or Mumbai).

### **Phase 6: Final Touches & Presentation (30-36 Hours)**

* Polish the UI, add more documentation if needed.
* Prepare for project submissio