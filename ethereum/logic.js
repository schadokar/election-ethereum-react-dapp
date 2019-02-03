const fs = require("fs-extra");
const {web3, web3Network} = require("./web3");
const compileContract = require("./build/Election.json");

let contractReceipt;
if(web3Network == "ganache") {
    contractReceipt = require("./receipt-ganache.json");
}
else if (web3Network == "rinkeby") {
    contractReceipt = require("./receipt-rinkeby.json");
}

// Contract object deployed on network (ganache-cli or testnet or mainnet)
// network can be selected in web3 file

const contractObject = new web3.eth.Contract(
    JSON.parse(compileContract.interface),
    contractReceipt.address
);

const addVoter = async (voterId, name, email, phoneNo, consituency, age) => {
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
                    .addVoter(voterId, name, email, phoneNo, consituency, age)
                    .send({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("Voter added in the consituency successfully!");
    return receipt;
};

const getVoter = async (voterId) => {
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .voterData(voterId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

const addCandidate = async (voterId, name, email, phoneNo, consituency) => {
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
                    .addCandidate(voterId, name, email, phoneNo, consituency)
                    .send({from : accounts[0], gas : 1000000});
    console.info(receipt);
    console.info("Candidate added in the consituency successfully!");
    return receipt;
};

const getCandidate = async (candidateId) => {
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .candidateData(candidateId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

const castVote = async (candidateId) => {
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
                    .castVote(candidateId)
                    .send({from : accounts[1], gas : 1000000});
    console.log(receipt);
    console.info("Voter's vote casted successfully!");
    return receipt;
};

const getVotingCount = async (consituency, candidateId) => {
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .consituencyCandidateList(consituency, candidateId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
}

module.exports = {
    addVoter,
    getVoter,
    addCandidate,
    getCandidate,
    castVote,
    getVotingCount
};