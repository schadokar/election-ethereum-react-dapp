const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

let web3;
let web3Network;

// Rinkeby network setup
const provider = new HDWalletProvider(
    'artwork hill symptom faith that stable emotion bottom tiger hole you myth',
    'https://rinkeby.infura.io/v3/7dc74c74e44049d6aee413c6d966c3e1'
);

//web3 = new Web3(provider);
//web3Network = "rinkeby";

// const ganache = require("ganache-cli");
// web3 = new Web3(ganache.provider());

// local ganache-cli setup 
const eventProvider = new Web3.providers.WebsocketProvider(
  "ws://localhost:8545"
);
if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
web3Network = "ganache";
web3.setProvider(eventProvider);

module.exports = {
    web3,
    web3Network
};