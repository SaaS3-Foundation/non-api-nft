const Nft = artifacts.require('./Nft.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Nft', (accounts) => {
  let contract

  before(async () => {
    contract = await Nft.deployed()
  })

  describe('deployment', async () => {
    it('deployed successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Nft')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'NFT')
    })

  })

  describe('minting', async () => {

    let result, nftCount
    const fileName = 'fileName1'
    const fileHash = 'fileHash1'
    const fileType = 'image/jpeg'
    const fileSize = 1

    before(async () => {
      result = await contract.mint(fileName, fileHash, fileType, fileSize)
      nftCount = await contract.nftCount()
    })

    it('created a new token', async () => {
      const totalSupply = await contract.totalSupply()

      // SUCCESS
      assert.equal(totalSupply, 1)
      assert.equal(nftCount, 1)

      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 0, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same nft twice
      await contract.mint(fileName, fileHash, fileType, fileSize).should.be.rejected;

      // FAILURE: cannot mint nft with same name twice
      await contract.mint(fileName, "a different hash", fileType, fileSize).should.be.rejected;

      // FAILURE: cannot mint nft with same hash twice
      await contract.mint("a different name", fileHash, fileType, fileSize).should.be.rejected;
      
      // FAILURE: NFT name must not be empty
      await contract.mint('', fileHash, fileType, fileSize).should.be.rejected;

      // FAILURE: NFT hash must not be empty
      await contract.mint(fileName, '', fileType, fileSize).should.be.rejected;
      
      // FAILURE: NFT type must not be empty
      await contract.mint(fileName, fileHash, '', fileSize).should.be.rejected;

      // FAILURE: NFT size must not be empty
      await contract.mint(fileName, fileHash, fileType, '').should.be.rejected;

      // FAILURE: cannot mint nft with file type that is not image/jpeg or image/png or image/tiff or image/gif
      await contract.mint("a different name", "a different hash", "a different type", fileSize).should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('listed nfts', async () => {
      // Mint 3 more files
      await contract.mint('fileName2', 'fileHash2', 'image/jpeg', 2)
      await contract.mint('fileName3', 'fileHash3', 'image/jpeg', 3)
      await contract.mint('fileName4', 'fileHash4', 'image/jpeg', 4)
      const totalSupply = await contract.totalSupply()

      let nft

      // SUCCESS
      for (var i = 2; i <= totalSupply; i++) {
        nft = await contract.nfts(i - 1)
        assert.equal(nft.fileId.toNumber(), i, 'id is correct')
        assert.equal(nft.fileName, 'fileName' + i, 'Name is correct')
        assert.equal(nft.fileHash, 'fileHash' + i, 'Hash is correct')
        assert.equal(nft.fileType, 'image/jpeg', 'Size is correct')
        assert.equal(nft.fileSize, i, 'Size is correct')
      }
    })
  })

})
