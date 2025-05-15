// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoodNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => int256) public moodScore;
    mapping(uint256 => string) public moodStatus;

    address public oracle;

    // Event for mood updates
    event MoodUpdated(uint256 indexed tokenId, int256 moodScore, string moodStatus);

    constructor() ERC721("MoodNFT", "MNFT") {
        tokenCounter = 0;
    }

    // Minting function
    function mintNFT(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        moodScore[tokenId] = 0; // Default mood score
        moodStatus[tokenId] = "Neutral"; // Default mood status
        tokenCounter++;
        return tokenId;
    }

    // Modifier to allow only the oracle to update moods
    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized: caller is not the oracle");
        _;
    }

    // Function to update mood and status from the oracle
    function updateMood(uint256 tokenId, int256 newMood, string memory newStatus) public onlyOracle {
        require(_exists(tokenId), "ERC721: token does not exist");

        moodScore[tokenId] = newMood;
        moodStatus[tokenId] = newStatus;

        emit MoodUpdated(tokenId, newMood, newStatus); // Emit an event for tracking
    }

    // Set oracle address to authorize oracle for updates
    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }
}
