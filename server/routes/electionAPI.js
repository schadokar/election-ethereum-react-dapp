const express = require("express");
const router = express.Router();
const logic = require("../../ethereum/logic");

// get available accounts
router.get("/accounts", async (req, res, next) => {
  try {
    console.log("Inside the accounts");
    const result = await logic.getAccounts();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// create a new election
router.post("/newElection", async function(req, res, next) {
  try {
    console.log("inside the ElectionAPI", req.body);
    const result = await logic.createElection(
      req.body.account,
      req.body.duration,
      req.body.electionName
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get all conducted election list
router.get("/getElections", async function(req, res, next) {
  try {
    const result = await logic.getConductedElections();
    console.log("list of conducted elections! ", result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get a conducted election on index
router.get("/getElections/:index", async function(req, res, next) {
  try {
    const result = await logic.getElectionAddress(parseInt(req.params.index));
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get admin of conducted election at address
router.get("/getElectionAdmin/:address", async function(req, res, next) {
  try {
    const result = await logic.getElectionAdmin(req.params.address);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get election name of conducted eletion
router.get("/getElectionName/:address", async function(req, res, next) {
  try {
    const result = await logic.getElectionName(req.params.address);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// add Consituency to Consituency list
router.post("/addConsituency/:address", async function(req, res, next) {
  try {
    const address = req.params.address;
    const { account, consituencyId, consituencyName } = req.body;
    const result = await logic.addConsituency(
      account,
      address,
      consituencyId,
      consituencyName
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get consituency list from Consituency list
router.get("/getConsituencyList/:address", async function(req, res, next) {
  try {
    const result = await logic.getConsituencyList(req.params.address);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get consituency data from Consituency list
router.get("/getConsituency/:address", async function(req, res, next) {
  //console.log("api", req.query, req.body, req.params);
  try {
    const result = await logic.getConsituency(
      req.params.address,
      req.query.consituencyId
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// add voter to voter list
router.post("/addVoter/:address", async function(req, res, next) {
  try {
    const {
      account,
      voterId,
      name,
      email,
      phoneNo,
      consituency,
      age
    } = req.body;

    const result = await logic.addVoter(
      req.params.address,
      account,
      voterId,
      name,
      email,
      phoneNo,
      consituency,
      parseInt(age)
    );
    res.send(result);
  } catch (error) {
    console.error("Router:", error);
    res.send(error);
  }
});

// get voter list from Voter List
router.get("/getVoterList/:address", async function(req, res, next) {
  try {
    const result = await logic.getVoterList(req.params.address);
    // console.log("router: Get voter list: ", result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get voter data from voter list
router.get("/getVoter/:address", async function(req, res, next) {
  try {
    console.log("Get VOter:", req.query);
    const result = await logic.getVoter(req.params.address, req.query.voterId);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// add candidate to election candidate list
router.post("/addCandidate/:address", async function(req, res, next) {
  try {
    console.log(req.body);
    const {
      account,
      candidateId,
      name,
      email,
      phoneNo,
      consituency,
      party
    } = req.body;
    const result = await logic.addCandidate(
      req.params.address,
      account,
      candidateId,
      name,
      email,
      phoneNo,
      consituency,
      party
    );
    // console.log("---", result.message, "---");
    res.send(result);
  } catch (error) {
    next(error);
    //console.error("electionAPI: addcandidate", error);
    //res.status(422).send({ error: error.message });
  }
});

// get candidate list from candidate List
router.get("/getCandidateList/:address", async function(req, res, next) {
  try {
    const result = await logic.getCandidateList(req.params.address);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get candidate data from candidate list
router.get("/getCandidate/:address", async function(req, res, next) {
  try {
    const result = await logic.getCandidate(
      req.params.address,
      req.query.candidateId
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(101);
  }
});

// get candidate list enrolled in a voter's consituency
router.get("/getVoterConsituencyCandidates/:address", async function(
  req,
  res,
  next
) {
  try {
    const result = await logic.getVoterConsituencyCandidates(
      req.params.address,
      req.query.voterId,
      req.query.consituencyId
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// cast the vote to candidate of respective consituency
router.post("/castVote/:address", async function(req, res, next) {
  try {
    console.info(
      req.body.voterId,
      req.body.consituencyId,
      req.body.candidateId
    );
    const result = await logic.castVote(
      req.params.address,
      req.body.voterId,
      req.body.consituencyId,
      req.body.candidateId
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get voting count of a candidate of a respective consituency
router.get("/getCandidateVotes/:address", async function(req, res, next) {
  try {
    const result = await logic.getCandidateVotes(
      req.params.address,
      req.body.consituency,
      req.body.candidateId
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// close the Election
router.post("/closeElection/:address", async (req, res, next) => {
  try {
    const result = await logic.closeElection(
      req.params.address,
      req.body.account
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get the winner of the election
router.get("/electionResult/:address", async (req, res, next) => {
  try {
    const result = await logic.electionResult(req.params.address);
    console.log("election winner api result", result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// get the winner of the election
router.get("/electionData/:address", async (req, res, next) => {
  try {
    const result = await logic.electionData(req.params.address);
    console.log("election winner api result", result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});
module.exports = router;
