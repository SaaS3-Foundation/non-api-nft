const Nft = artifacts.require("Nft");

module.exports = function(deployer, _network) {
  deployer.deploy(Nft);
};
