// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Nft is ERC721, ERC721Enumerable {
  
  File[] public nfts;
  uint public nftCount = 0;
  mapping(string => bool) _hashExists;
  mapping(string => bool) _nameExists;
  address public admin;

  struct File {
    uint fileId;
    string fileName;
    string fileHash;
    string fileType;
    uint fileSize;
    address minter;
  }

  event FileMinted(
    uint fileId,
    string fileName,
    string fileHash,
    string fileType,
    uint fileSize,
    address minter
  );

  constructor() ERC721("Nft", "NFT") {
    admin = msg.sender;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
      internal
      override(ERC721, ERC721Enumerable)
  {
      super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC721, ERC721Enumerable)
      returns (bool)
  {
      return super.supportsInterface(interfaceId);
  }

  function mint(string memory _fileName, string memory _fileHash, string memory _fileType, uint _fileSize) external {
    require(!_nameExists[_fileName], 'file name must be unique');
    require(!_hashExists[_fileHash], 'file hash must be unique');
    require(bytes(_fileName).length > 0, 'file name must not be empty');
    require(bytes(_fileHash).length > 0, 'file hash must not be empty');
    require(bytes(_fileType).length > 0, 'file type must not be empty');
    require(_fileSize > 0);

    nftCount ++;
    File memory file = File(nftCount, _fileName, _fileHash, _fileType, _fileSize, msg.sender);

    nfts.push(file);
    _safeMint(msg.sender, nfts.length - 1);
    _nameExists[_fileName] = true;
    _hashExists[_fileHash] = true;
    emit FileMinted(nftCount, _fileName, _fileHash, _fileType, _fileSize, msg.sender);
  }
}
