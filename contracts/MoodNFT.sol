// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title MoodNFT - An ERC721 NFT with AI-influenced dynamic metadata
contract MoodNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Strings for int256;

    uint256 public tokenCounter;
    mapping(uint256 => int256) public moodScore;
    mapping(uint256 => string) public moodStatus;
    mapping(uint256 => uint256) public experiencePoints;
    mapping(uint256 => uint256) public level;
    mapping(uint256 => uint256) public lastInteractionTime;
    mapping(uint256 => uint256) public interactionCount;
    mapping(uint256 => uint256) public lastActivityTime;
    mapping(address => bool) public hasMinted;
    address public oracle;

    // Constants for leveling system
    uint256 public constant XP_PER_INTERACTION = 10;
    uint256 public constant XP_FOR_LEVEL_UP = 100;
    uint256 public constant COOLDOWN_PERIOD = 1 minutes;
    uint256 public constant INACTIVITY_THRESHOLD = 5 minutes;
    int256 public constant SCORE_DECREASE = -5;
    int256 public constant NEGATIVE_INTERACTION_PENALTY = -15;

    // Events
    event MoodUpdated(uint256 indexed tokenId, int256 moodScore, string moodStatus);
    event ExperienceGained(uint256 indexed tokenId, uint256 xpGained, uint256 newTotal);
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);
    event Interaction(uint256 indexed tokenId, address indexed user, uint256 timestamp);
    event ScoreDecreased(uint256 indexed tokenId, int256 newScore, string reason);
    event NFTMinted(address indexed to, uint256 tokenId);

    constructor() ERC721("MoodNFT", "MNFT") {
        tokenCounter = 0;
    }

    /// @notice Mint a new NFT to the specified address
    function mintNFT(address to) public returns (uint256) {
        require(!hasMinted[to], "Address has already minted an NFT");
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        
        // Initialize with neutral values
        moodScore[tokenId] = 0;
        moodStatus[tokenId] = "Neutral";
        experiencePoints[tokenId] = 0;
        level[tokenId] = 1;
        lastInteractionTime[tokenId] = block.timestamp;
        lastActivityTime[tokenId] = block.timestamp;
        interactionCount[tokenId] = 0;
        hasMinted[to] = true;
        
        tokenCounter++;
        emit NFTMinted(to, tokenId);
        return tokenId;
    }

    /// @notice Modifier to allow only the oracle to update moods
    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized: caller is not the oracle");
        _;
    }

    /// @notice Update mood and status from the oracle
    function updateMood(uint256 tokenId, int256 newMood, string memory newStatus) public onlyOracle {
        require(_exists(tokenId), "ERC721: token does not exist");
        moodScore[tokenId] = newMood;
        moodStatus[tokenId] = newStatus;
        lastActivityTime[tokenId] = block.timestamp;
        emit MoodUpdated(tokenId, newMood, newStatus);
    }

    /// @notice Set oracle address to authorize oracle for updates
    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    /// @notice Interact with an NFT (positive interaction)
    function interact(uint256 tokenId) public {
        require(_exists(tokenId), "ERC721: token does not exist");
        require(block.timestamp >= lastInteractionTime[tokenId] + COOLDOWN_PERIOD, "Cooldown period not over");
        
        // Update interaction tracking
        lastInteractionTime[tokenId] = block.timestamp;
        lastActivityTime[tokenId] = block.timestamp;
        interactionCount[tokenId]++;

        // Award experience points
        uint256 xpGained = XP_PER_INTERACTION;
        experiencePoints[tokenId] += xpGained;
        emit ExperienceGained(tokenId, xpGained, experiencePoints[tokenId]);

        // Check for level up
        uint256 currentLevel = level[tokenId];
        uint256 xpForNextLevel = currentLevel * XP_FOR_LEVEL_UP;
        if (experiencePoints[tokenId] >= xpForNextLevel) {
            level[tokenId]++;
            emit LevelUp(tokenId, level[tokenId]);
        }

        emit Interaction(tokenId, msg.sender, block.timestamp);
    }

    /// @notice Negative interaction with NFT
    function negativeInteract(uint256 tokenId) public {
        require(_exists(tokenId), "ERC721: token does not exist");
        require(block.timestamp >= lastInteractionTime[tokenId] + COOLDOWN_PERIOD, "Cooldown period not over");
        
        // Update interaction tracking
        lastInteractionTime[tokenId] = block.timestamp;
        lastActivityTime[tokenId] = block.timestamp;
        interactionCount[tokenId]++;

        // Apply negative score
        moodScore[tokenId] += NEGATIVE_INTERACTION_PENALTY;
        if (moodScore[tokenId] < -100) moodScore[tokenId] = -100;
        
        // Update status based on score
        if (moodScore[tokenId] <= -50) {
            moodStatus[tokenId] = "Very Sad";
        } else if (moodScore[tokenId] <= -25) {
            moodStatus[tokenId] = "Sad";
        } else {
            moodStatus[tokenId] = "Disappointed";
        }

        emit ScoreDecreased(tokenId, moodScore[tokenId], "Negative Interaction");
        emit Interaction(tokenId, msg.sender, block.timestamp);
    }

    /// @notice Check and update score based on inactivity
    function checkInactivity(uint256 tokenId) public {
        require(_exists(tokenId), "ERC721: token does not exist");
        
        if (block.timestamp >= lastActivityTime[tokenId] + INACTIVITY_THRESHOLD) {
            moodScore[tokenId] += SCORE_DECREASE;
            if (moodScore[tokenId] < -100) moodScore[tokenId] = -100;
            
            // Update status based on score
            if (moodScore[tokenId] <= -50) {
                moodStatus[tokenId] = "Very Sad";
            } else if (moodScore[tokenId] <= -25) {
                moodStatus[tokenId] = "Sad";
            } else if (moodScore[tokenId] < 0) {
                moodStatus[tokenId] = "Disappointed";
            }
            
            lastActivityTime[tokenId] = block.timestamp;
            emit ScoreDecreased(tokenId, moodScore[tokenId], "Inactivity");
        }
    }

    /// @notice Get NFT stats
    function getNFTStats(uint256 tokenId) public view returns (
        int256 mood,
        string memory status,
        uint256 xp,
        uint256 currentLevel,
        uint256 interactions,
        uint256 lastInteraction,
        uint256 lastActivity
    ) {
        require(_exists(tokenId), "ERC721: token does not exist");
        return (
            moodScore[tokenId],
            moodStatus[tokenId],
            experiencePoints[tokenId],
            level[tokenId],
            interactionCount[tokenId],
            lastInteractionTime[tokenId],
            lastActivityTime[tokenId]
        );
    }

    /// @notice Return on-chain metadata as base64-encoded JSON
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721: token does not exist");
        string memory name = string(abi.encodePacked("MoodNFT #", tokenId.toString()));
        string memory description = "An NFT with AI-influenced mood and interactive features.";
        string memory image = "ipfs://example-image-uri"; // Replace with your image logic or keep static
        string memory attributes = string(abi.encodePacked(
            '[{"trait_type":"Mood Score","value":', moodScore[tokenId].toString(),
            '},{"trait_type":"Mood Status","value":"', moodStatus[tokenId],
            '"},{"trait_type":"Level","value":', level[tokenId].toString(),
            '},{"trait_type":"Experience Points","value":', experiencePoints[tokenId].toString(),
            '},{"trait_type":"Total Interactions","value":', interactionCount[tokenId].toString(),
            '},{"trait_type":"Last Activity","value":', lastActivityTime[tokenId].toString(),
            '}]'
        ));
        string memory json = string(abi.encodePacked(
            '{"name":"', name, '",',
            '"description":"', description, '",',
            '"image":"', image, '",',
            '"attributes":', attributes, '}'
        ));
        string memory encoded = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encoded));
    }

    // The following functions are overrides required by Solidity for ERC721Enumerable
    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

/// @notice Base64 encoding library (Brecht Devos, MIT license)
library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        string memory table = TABLE;
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        assembly {
            mstore(result, encodedLen)
            let tablePtr := add(table, 1)
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            let resultPtr := add(result, 32)
            for {} lt(dataPtr, endPtr) {}
            {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        return result;
    }
}
