const fs = require("fs-extra");
const { web3, web3Network } = require("./web3");
const path = require("path");
// Contract object deployed on network (ganache-cli or testnet or mainnet)
// network can be selected in web3 file
const getFactoryObject = () => {
  try {
    const compileFactoryContract = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "build", "ElectionFactory.json"),
        "utf8"
      )
    );
    let contractReceipt;
    if (web3Network == "ganache") {
      contractReceipt = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "./receipt-ganache.json"),
          "utf8"
        )
      );
    } else if (web3Network == "rinkeby") {
      contractReceipt = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "./receipt-rinkeby.json"),
          "utf8"
        )
      );
    }

    const contractObject = new web3.eth.Contract(
      JSON.parse(compileFactoryContract.interface),
      contractReceipt.address
    );
    return contractObject;
  } catch (error) {
    console.error(error);
    throw error.message;
  }
};

const getAccounts = async () => {
  try {
    return await web3.eth.getAccounts();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createElection = async (account, durationInMins, electionName) => {
  try {
    const contractObject = getFactoryObject();
    const accounts = await web3.eth.getAccounts();
    const receipt = await contractObject.methods
      .createElection(durationInMins, electionName)
      .send({ from: accounts[account], gas: 4000000 });
    console.info(receipt);
    console.info("New Election successfully created!");
    return receipt;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getConductedElections = async () => {
  try {
    const contractObject = await getFactoryObject();
    const accounts = await web3.eth.getAccounts();
    let result = [];
    const elections = await contractObject.methods
      .getElections()
      .call({ from: accounts[0] });

    for (let i = 0; i < elections.length; i++) {
      const electionObject = await getContractObject(elections[i]);
      const electionName = await electionObject.methods
        .electionName()
        .call({ from: accounts[0] });
      result.push({
        electionAddress: elections[i],
        electionName: electionName,
      });
    }

    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getElectionAddress = async (index) => {
  try {
    const elections = await getConductedElections();

    return elections[index];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getContractObject = (address) => {
  try {
    const compileContract = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "./build/Election.json"), "utf8")
    );
    const contractObject = new web3.eth.Contract(
      JSON.parse(compileContract.interface),
      address
    );

    return contractObject;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getElectionAdmin = async (address) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
      .admin()
      .call({ from: accounts[0] });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getElectionName = async (address) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
      .electionName()
      .call({ from: accounts[0] });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addConsituency = async (account, address, consituencyId, name) => {
  let response = {};
  try {
    const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject(address);
    console.info(`Sending transaction from account ${accounts[account]}`);
    const receipt = await contractObject.methods
      .addConsituency(parseInt(consituencyId), name)
      .send({ from: accounts[account], gas: 1000000 });
    console.info(receipt);
    console.info("Consituency successfully added!");
    //  console.info(web3.utils.fromAscii(consituency));
    response["status"] = true;
    response["message"] = "Consituency successfully added!";
    response["transactionHash"] = receipt.transactionHash;
    return response;
  } catch (error) {
    console.error("ERROR: ", error.message);
    response["status"] = false;
    response["message"] = error.message.split("revert")[1];
    return response;
  }
};

// get all the added consituency
const getConsituencyList = async (address) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const consituencyIdList = await contractObject.methods
      .getConsituencyIdList()
      .call({ from: accounts[0] });
    // console.log(consituencyIdList);
    const consituencyList = await consituencyIdList.map((consituencyId) =>
      getConsituency(address, consituencyId)
    );
    let result = await Promise.all(consituencyList);
    //   console.log("Inside getCOnsituencyList", result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get the consituency
const getConsituency = async (address, consituencyId) => {
  try {
    //console.log("logic", consituencyId);
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
      .consituencyData(consituencyId)
      .call({ from: accounts[0] });
    //    console.log("inside consituency", result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  let response = {};
  try {
    const contractObject = getContractObject(address);
    const receipt = await contractObject.methods
      .addVoter(voterId, name, email, phoneNo, consituency, age)
      .send({ from: account, gas: 3000000 });
    console.info(receipt);
    console.info("Voter successfully added in the consituency !");
    response["status"] = true;
    response["message"] = "Voter successfully added in the consituency!";
    response["transactionHash"] = receipt.transactionHash;
    return response;
  } catch (error) {
    // console.error("ERROR: ", error);
    console.error("ERROR: ", error.message);
    response["status"] = false;
    response["message"] = error.message.split("revert")[1];
    return response;
  }
};

const getVoterList = async (address) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const votersIdList = await contractObject.methods
      .getVotersIdList()
      .call({ from: accounts[0] });
    console.log("logic: get voter list:", votersIdList);
    const votersList = await votersIdList.map((voter) =>
      getVoter(address, voter)
    );

    return await Promise.all(votersList);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getVoter = async (address, voterId) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
      .voterData(voterId)
      .call({ from: accounts[0] });
    // console.log("getVoter", result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addCandidate = async (
  address,
  account,
  candidateId,
  name,
  email,
  phoneNo,
  consituencyId,
  party
) => {
  let response = {};
  try {
    // first check if a candidate is already registered from a party to a consituency

    const consituencyCandidates = await getConsituencyCandidates(
      address,
      account,
      parseInt(consituencyId)
    );

    let status = false;

    if (consituencyCandidates.length) {
      await Promise.all(
        consituencyCandidates.map(async (obj) => {
          const candidate = await getCandidate(address, obj);
          console.log(obj, "----<>");
          if (candidate.party == party.toUpperCase()) {
            status = true;
          } else status = false;
        })
      );
    }
    if (!status) {
      const contractObject = getContractObject(address);
      // const accounts = await web3.eth.getAccounts();
      const receipt = await contractObject.methods
        .addCandidate(
          candidateId,
          name,
          email,
          phoneNo,
          consituencyId,
          party.toUpperCase()
        )
        .send({ from: account, gas: 1000000 });
      console.info(receipt);
      console.info("Candidate successfully added in the consituency!");
      response["status"] = true;
      response["message"] = "Candidate successfully added in the consituency!";
      response["transactionHash"] = receipt.transactionHash;
    } else {
      console.log("Party's candidate already registered");
      response["status"] = false;
      response["message"] = "Party's candidate already registered";
      response["transactionHash"] = null;
    }
    return response;
  } catch (error) {
    console.error("logic.js: add candidate", error);
    response["status"] = false;
    response["message"] = error.message.split("revert")[1];

    return response;
  }
};

const getCandidateList = async (address) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();

    const candidateIdList = await contractObject.methods
      .getCandidatesIdList()
      .call({ from: accounts[0] });

    const candidateList = await candidateIdList.map((candidateId) =>
      getCandidate(address, candidateId)
    );
    // console.log(candidateList);
    return await Promise.all(candidateList);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCandidate = async (address, candidateId) => {
  try {
    const contractObject = getContractObject(address);
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
      .candidateData(candidateId)
      .call({ from: accounts[0] });
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get the candidateList enrolled in a consituency
const getConsituencyCandidates = async (address, account, consituencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contractObject = getContractObject(address);
      //const accounts = await web3.eth.getAccounts();
      const candidateList = await contractObject.methods
        .getConsituencyCandidates(consituencyId)
        .call({ from: account });
      // console.log(
      //   "inside get consituency candidates: canidateList",
      //   candidateList
      // );

      resolve(candidateList);
    } catch (error) {
      console.error("get consituency candidates: ", error);
      reject(error);
    }
  });
};

// get candidates of voter's consituency
const getVoterConsituencyCandidates = async (
  address,
  voterId,
  consituencyId
) => {
  try {
    const candidateList = await getConsituencyCandidates(
      address,
      voterId,
      consituencyId
    );

    let result = {
      consituencyId: consituencyId,
      candidateList: candidateList,
    };
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const castVote = async (address, voterId, consituencyId, candidateId) => {
  let response = {};
  try {
    // console.log(
    //   "CAST VOTE",
    //   address,
    //   voterId,
    //   consituencyId,
    //   candidateId,
    //   "CAST VOTE"
    // );
    const contractObject = getContractObject(address);
    const receipt = await contractObject.methods
      .castVote(consituencyId, candidateId)
      .send({ from: voterId, gas: 1000000 });
    // console.log(receipt);
    console.info("Voter's vote casted successfully!");
    response["status"] = true;
    response["message"] = "Voter's vote casted successfully!";
    response["transactionHash"] = receipt.transactionHash;
    return response;
  } catch (error) {
    console.error("ERROR: ", error.message);
    response["status"] = false;
    response["message"] = error.message.split("revert")[1];
    return response;
  }
};

const getCandidateVotes = async (address, consituencyId, candidateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contractObject = getContractObject(address);
      const accounts = await web3.eth.getAccounts();
      const result = await contractObject.methods
        .getVotes(consituencyId, candidateId)
        .call({ from: accounts[0] });
      console.log("inside getCandidateVotes", result);
      resolve(result);
    } catch (error) {
      console.error("get candidate votes: ", error);
      reject(error);
    }
  });
};

const closeElection = async (address, account) => {
  let response = {};
  try {
    // const accounts = await web3.eth.getAccounts();
    const contractObject = getContractObject(address);
    const receipt = await contractObject.methods
      .closeElection()
      .send({ from: account, gas: 1000000 });
    // console.info(receipt);
    console.info("Election closed successfully!");
    response["status"] = true;
    response["message"] = "Election closed successfully!";
    response["transactionHash"] = receipt.transactionHash;
    return response;
  } catch (error) {
    console.error("ERROR: ", error.message);
    response["status"] = false;
    response["message"] = error.message.split("revert")[1];
    return response;
  }
};

const electionData = async (address) => {
  try {
    const accounts = await web3.eth.getAccounts();

    const consituencyList = await getConsituencyList(address);

    const consituencyIdList = consituencyList.map((consituency) =>
      parseInt(consituency.consituencyId)
    );

    const consituencyCandidateList = await Promise.all(
      consituencyIdList.map(async (consituencyId) => ({
        consituencyId: consituencyId,
        candidateList: await getConsituencyCandidates(
          address,
          accounts[0],
          consituencyId
        ),
      }))
    );
    // console.log(consituencyCandidateList);
    let electionData = await Promise.all(
      consituencyCandidateList.map(
        async ({ consituencyId, candidateList }) =>
          await Promise.all(
            candidateList.map(async (candidateId) => {
              const candidate = await getCandidate(address, candidateId);
              const consituency = await getConsituency(address, consituencyId);
              return {
                consituencyId: consituencyId,
                consituencyName: consituency.name,
                candidateId: candidateId,
                candidateName: candidate.name,
                candidateParty: candidate.party,
                votes: await getCandidateVotes(
                  address,
                  consituencyId,
                  candidateId
                ),
              };
            })
          )
      )
    );

    // merge the nested arrays in one using reduce and concat
    electionData = [].concat(...electionData);
    //  console.log("Votes---> ", votes);
    return electionData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const electionResult = async (address) => {
  try {
    // get all the election data, candidate vote count
    const electionDataArr = await electionData(address);
    // get all the consituency list names
    const consituencyList = [
      ...new Set(electionDataArr.map((obj) => obj.consituencyId)),
    ];
    //console.log(consituencyList);

    // Initiate the partyCount with object (party, seat count, index)
    let partyCount = [
      ...new Set(electionDataArr.map((obj) => obj.candidateParty)),
    ].map((party, index) => ({
      party: party,
      count: 0,
      index: index,
    }));
    //console.log(partyCount);

    // who won the consituency
    consituencyList.forEach((consituencyId) => {
      // filter the candidates as per the consituency
      const data = electionDataArr.filter(
        (obj) => obj.consituencyId == consituencyId
      );

      let maxVotes = 0;
      let party = [];

      data.forEach((obj) => {
        if (maxVotes <= obj.votes && obj.votes > 0) {
          maxVotes = obj.votes;
          party.push(obj.candidateParty);
        }
      });
      // console.log("win party", maxVotes, party);
      if (party.length == 1) {
        partyCount.forEach((obj) => {
          if (obj.party === party[0]) {
            obj.count++;
          }
        });
      }
    });
    //console.log("PAr", partyCount);
    let winningParty = [];
    let winningSeats = partyCount
      .map((party) => party.count)
      .reduce((a, b) => {
        // console.log("a,b", a, b);
        return Math.max(a, b);
      });
    console.log("wseats", winningSeats);

    partyCount.forEach((obj) => {
      if (winningSeats <= obj.count) {
        winningSeats = obj.count;
        winningParty.push(obj.party);
      }
    });
    //console.log(winningParty, winningSeats, "----><");
    return [partyCount, winningParty, winningSeats];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAccounts,
  createElection,
  getConductedElections,
  getElectionAddress,
  getElectionAdmin,
  getElectionName,
  addConsituency,
  getConsituencyList,
  getConsituency,
  addVoter,
  getVoterList,
  getVoter,
  addCandidate,
  getCandidateList,
  getCandidate,
  getConsituencyCandidates,
  getVoterConsituencyCandidates,
  castVote,
  getCandidateVotes,
  closeElection,
  electionResult,
  electionData,
};
