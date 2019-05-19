const fs = require("fs-extra");
const { web3, web3Network } = require("./web3");
const compileFactoryContract = require("./build/ElectionFactory.json");
const compileContract = require("./build/Election.json");

// Contract object deployed on network (ganache-cli or testnet or mainnet)
// network can be selected in web3 file
const getFactoryObject = () => {
  let contractReceipt;
  if (web3Network == "ganache") {
    contractReceipt = require("./receipt-ganache.json");
  } else if (web3Network == "rinkeby") {
    contractReceipt = require("./receipt-rinkeby.json");
  }

  const contractObject = new web3.eth.Contract(
    JSON.parse(compileFactoryContract.interface),
    contractReceipt.address
  );
  return contractObject;
};

const getAccounts = async () => {
  return await web3.eth.getAccounts();
};

const createElection = async (account, durationInMins) => {
  const contractObject = getFactoryObject();
  const accounts = await web3.eth.getAccounts();
  const receipt = await contractObject.methods
    .createElection(durationInMins)
    .send({ from: accounts[account], gas: 4000000 });
  console.info(receipt);
  console.info("New Election successfully created!");
  return receipt;
};

const getConductedElections = async () => {
  const contractObject = getFactoryObject();
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .getElections()
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const getElectionAddress = async index => {
  const elections = await getConductedElections();

  return elections[index];
};

const getContractObject = address => {
  const contractObject = new web3.eth.Contract(
    JSON.parse(compileContract.interface),
    address
  );

  return contractObject;
};

const getElectionAdmin = async address => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .admin()
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const addConsituency = async (account, address, consituency) => {
  const accounts = await web3.eth.getAccounts();
  const contractObject = getContractObject(address);
  console.info(`Sending transaction from account ${accounts[account]}`);
  const receipt = await contractObject.methods
    .addConsituency(consituency)
    .send({ from: accounts[account], gas: 1000000 });
  console.info(receipt);
  console.info("Consituency successfully added!");
  return receipt;
};

// get all the added consituency
const getConsituencyList = async address => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const listLength = await contractObject.methods
    .getConsituencyList()
    .call({ from: accounts[0] });
  // console.log(listLength);

  let consituencyList = [];
  for (let i = 0; i < listLength; i++) {
    let consituency = await contractObject.methods
      .consituencyList(i)
      .call({ from: accounts[0] });
    // console.log("consituency: ", i, consituency);
    consituencyList.push(consituency.consituencyId);
  }
  // console.log(consituencyList);
  return consituencyList;
};
const getConsituency = async (address, consituencyId) => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .consituencyData(consituencyId)
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const addVoter = async (
  address,
  account,
  voterId,
  name,
  email,
  phoneNo,
  consituency,
  age
) => {
  const accounts = await web3.eth.getAccounts();
  const contractObject = getContractObject(address);
  const receipt = await contractObject.methods
    .addVoter(accounts[voterId], name, email, phoneNo, consituency, age)
    .send({ from: accounts[account], gas: 3000000 });
  console.info(receipt);
  console.info("Voter successfully added in the consituency !");
  return receipt;
};

const getVoter = async (address, voterId) => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .voterData(accounts[voterId])
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const addCandidate = async (
  address,
  account,
  candidateId,
  name,
  email,
  phoneNo,
  consituency
) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
      .addCandidate(accounts[candidateId], name, email, phoneNo, consituency)
      .send({ from: accounts[account], gas: 1000000 });
    console.info(receipt);
    console.info("Candidate successfully added in the consituency!");
    return receipt;
  } catch (error) {
    console.error("logic.js: add candidate", error);
    return error;
  }
};

const getCandidate = async (address, candidateId) => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .candidateData(accounts[candidateId])
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const castVote = async (address, account, candidateId) => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const receipt = await contractObject.methods
    .castVote(accounts[candidateId])
    .send({ from: accounts[account], gas: 1000000 });
  console.log(receipt);
  console.info("Voter's vote casted successfully!");
  return receipt;
};

const getVotingCount = async (address, consituency, candidateId) => {
  const contractObject = getContractObject(address);
  const accounts = await web3.eth.getAccounts();
  const result = await contractObject.methods
    .consituencyCandidateVotes(consituency, accounts[candidateId])
    .call({ from: accounts[0] });
  console.log(result);
  return result;
};

const closeElection = async (address, account) => {
  const accounts = await web3.eth.getAccounts();
  const contractObject = getContractObject(address);
  const receipt = await contractObject.methods
    .closeElection()
    .send({ from: accounts[account], gas: 1000000 });
  console.info(receipt);
  console.info("election closed successfully!");
  return receipt;
};

const winnerOfElection = async (address, account) => {
  const accounts = await web3.eth.getAccounts();
  const contractObject = getContractObject(address);
  const receipt = await contractObject.methods
    .winnerOfElection()
    .call({ from: accounts[account], gas: 1000000 });
  console.info(receipt);
  console.info("Winner of election!");
  return receipt;
};

module.exports = {
  getAccounts,
  createElection,
  getConductedElections,
  getElectionAddress,
  getElectionAdmin,
  addConsituency,
  getConsituencyList,
  getConsituency,
  addVoter,
  getVoter,
  addCandidate,
  getCandidate,
  castVote,
  getVotingCount,
  closeElection,
  winnerOfElection
};
