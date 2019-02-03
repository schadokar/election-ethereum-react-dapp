const express = require("express");
const router = express.Router();
const logic = require("../../ethereum/logic");

// add voter to voter list
router.post("/addVoter", async function(req, res, next) {
    console.log(req.body);
    const {voterId, name, email, phoneNo, consituency, age} = req.body;
    const result = await logic.addVoter(voterId, name, email, phoneNo, consituency, parseInt(age));
    res.send(result);
    res.end("Success");
});

// get voter data from voter list
router.get("/getVoter", async function(req, res, next) {
    const result = await logic.getVoter(req.body.voterId);
    res.send(result);
});

// add candidate to election candidate list
router.post("/addCandidate", async function(req, res, next) {
    console.log(req.body);
    const {candidateId, name, email, phoneNo, consituency} = req.body;
    const result = await logic.addCandidate(candidateId, name, email, phoneNo, consituency);
    res.send(result);
    res.end("Success");
});

// get candidate data from candidate list
router.get("/getCandidate", async function(req, res, next) {
    const result = await logic.getCandidate(req.body.candidateId);
    res.send(result);
});

router.post("/castVote", async function(req, res, next) {
    const result = await logic.castVote(req.body.candidateId);
    console.log(result);
    res.send(result);
});

router.get("/getVotingCount", async function(req, res, next) {
    const result = await logic.getVotingCount(req.body.consituency, req.body.candidateId);
    res.send(result);
});
module.exports = router;