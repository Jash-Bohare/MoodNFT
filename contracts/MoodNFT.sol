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
    address public oracle;

    // Event for mood updates
    event MoodUpdated(uint256 indexed tokenId, int256 moodScore, string moodStatus);

    constructor() ERC721("MoodNFT", "MNFT") {
        tokenCounter = 0;
    }

    /// @notice Mint a new NFT to the specified address
    function mintNFT(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        moodScore[tokenId] = 0; // Default mood score
        moodStatus[tokenId] = "Neutral"; // Default mood status
        tokenCounter++;
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
        emit MoodUpdated(tokenId, newMood, newStatus);
    }

    /// @notice Set oracle address to authorize oracle for updates
    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    /// @notice Return on-chain metadata as base64-encoded JSON
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721: token does not exist");
        string memory name = string(abi.encodePacked("MoodNFT #", tokenId.toString()));
        string memory description = "An NFT with AI-influenced mood.";
        string memory image = "ipfs://example-image-uri"; // Replace with your image logic or keep static
        string memory attributes = string(abi.encodePacked(
            '[{"trait_type":"Mood Score","value":', moodScore[tokenId].toString(),
            '},{"trait_type":"Mood Status","value":"', moodStatus[tokenId], '"}]'
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
