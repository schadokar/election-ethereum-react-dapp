const fs = require("fs-extra");
const {web3, web3Network} = require("./web3");
const compileContract = require("./build/Election.json");

// Contract object deployed on network (ganache-cli or testnet or mainnet)
// network can be selected in web3 file

const getContractObject = () => {
    let contractReceipt;
    if(web3Network == "ganache") {
        contractReceipt = require("./receipt-ganache.json");
    }
    else if (web3Network == "rinkeby") {
        contractReceipt = require("./receipt-rinkeby.json");
    }

    const contractObject = new web3.eth.Contract(
        JSON.parse(compileContract.interface),
        contractReceipt.address
    );

    return contractObject;
};

const addConsituency = async (consituency) => {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject();
    const receipt = await contractObject.methods
                    .addConsituency(consituency)
                    .send({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("Consituency successfully added!");
    return receipt;
};

const getConsituency = async (consituencyId) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .consituencyData(consituencyId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

const addVoter = async (voterId, name, email, phoneNo, consituency, age) => {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject();
    const receipt = await contractObject.methods
                    .addVoter(voterId, name, email, phoneNo, consituency, age)
                    .send({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("Voter added in the consituency successfully!");
    return receipt;
};

const getVoter = async (voterId) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .voterData(voterId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

const addCandidate = async (voterId, name, email, phoneNo, consituency) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
                    .addCandidate(voterId, name, email, phoneNo, consituency)
                    .send({from : accounts[0], gas : 1000000});
    console.info(receipt);
    console.info("Candidate added in the consituency successfully!");
    return receipt;
};

const getCandidate = async (candidateId) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .candidateData(candidateId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
};

const castVote = async (candidateId) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
                    .castVote(candidateId)
                    .send({from : accounts[1], gas : 1000000});
    console.log(receipt);
    console.info("Voter's vote casted successfully!");
    return receipt;
};

const getVotingCount = async (consituency, candidateId) => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .consituencyCandidateVotes(consituency, candidateId)
                   .call({from:accounts[0]});
    console.log(result);
    return result;
}

const closeElection = async () => {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject();
    const receipt = await contractObject.methods
                    .closeElection()
                    .send({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("election closed successfully!");
    return receipt;
};

const winnerOfElection = async () => {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject();
    const receipt = await contractObject.methods
                    .winnerOfElection()
                    .call({from : accounts[0], gas:1000000});
    console.info(receipt);
    console.info("Winner of election!");
    return receipt;
};

module.exports = {
    addConsituency,
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