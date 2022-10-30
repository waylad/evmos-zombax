// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract Cars is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => TokenMeta) private _tokenMeta;
    mapping(uint256 => address) private _creators;

    string baseURI;

    struct TokenMeta {
        uint256 id;
        uint256 price;
        string name;
        string uri;
        bool isOnSale;
    }

    constructor() ERC721("BattleNEVs Cars", "CAR") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public virtual onlyOwner {
        baseURI = _newBaseURI;
    }

    function getAllOnSale() public view virtual returns (TokenMeta[] memory) {
        TokenMeta[] memory tokensOnSale = new TokenMeta[](_tokenIds.current());
        uint256 counter = 0;
        for (uint256 i = 1; i < _tokenIds.current() + 1; i++) {
            if (_tokenMeta[i].isOnSale == true) {
                tokensOnSale[counter] = _tokenMeta[i];
                counter++;
            }
        }
        return tokensOnSale;
    }

    function setTokenSale(
        uint256 _tokenId,
        bool _isOnSale,
        uint256 _price
    ) public {
        require(_exists(_tokenId), "ERC721Metadata: Sale set of nonexistent token");
        require(_price > 0);
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].isOnSale = _isOnSale;
        setTokenPrice(_tokenId, _price);
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) public {
        require(_exists(_tokenId), "ERC721Metadata: Price set of nonexistent token");
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].price = _price;
    }

    function tokenPrice(uint256 tokenId) public view virtual returns (uint256) {
        require(_exists(tokenId), "ERC721Metadata: Price query for nonexistent token");
        return _tokenMeta[tokenId].price;
    }

    function _setTokenMeta(uint256 _tokenId, TokenMeta memory _meta) private {
        require(_exists(_tokenId));
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId] = _meta;
    }

    function updateTokenUri(uint256 _tokenId, string memory _uri) public {
        require(_exists(_tokenId));
        require(ownerOf(_tokenId) == _msgSender());
        _tokenMeta[_tokenId].uri = _uri;
    }

    function tokenMeta(uint256 _tokenId) public view returns (TokenMeta memory) {
        require(_exists(_tokenId));
        return _tokenMeta[_tokenId];
    }

    function purchaseToken(uint256 _tokenId) public payable nonReentrant {
        require(msg.sender != address(0) && msg.sender != ownerOf(_tokenId));
        require(msg.value >= _tokenMeta[_tokenId].price);
        address tokenSeller = ownerOf(_tokenId);
        payable(tokenSeller).transfer(msg.value);
        setApprovalForAll(tokenSeller, true);
        _transfer(tokenSeller, msg.sender, _tokenId);
        _tokenMeta[_tokenId].isOnSale = false;
    }

    function mintCollectable(
        address _owner,
        string memory _tokenURI,
        string memory _name,
        uint256 _price,
        bool _isOnSale
    ) public onlyOwner returns (uint256) {
        require(_price > 0);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);
        _creators[newItemId] = msg.sender;
        TokenMeta memory meta = TokenMeta(newItemId, _price, _name, _tokenURI, _isOnSale);
        _setTokenMeta(newItemId, meta);
        return newItemId;
    }

    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }

    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensCreated = 0;

        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            numberOfTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }
}
