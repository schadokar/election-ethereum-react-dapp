pragma solidity ^0.4.25;

contract ElectionFactory {
    
    address[] public electionConducted;

    event ElectionEvent(address _admin, address _electionAddress);
    
    function createElection (uint _durationInMinutes, string _electionName) public {
        address newElection = new Election(_durationInMinutes, msg.sender, _electionName);
        electionConducted.push(newElection);
        emit ElectionEvent(msg.sender, newElection);
    }
    
    function getElections() public view returns(address[] _conductedElection) {
        return electionConducted;
    }
    
}


contract Election {
    address public admin;
    string public electionName;
    bool electionStatus;
    uint electionDuration;

    struct Voter {
        address voterId;
        string name;
        string email;
        string phoneNo;
        uint consituencyId;
        uint8 age;
        bool voted;
    }
    
    struct Candidate {
        address candidateId;
        string name;
        string email;
        string phoneNo;
        uint consituencyId;
        string party;
    }
    
    struct Consituency {
        uint consituencyId;
        string name;
        address[] candidates;
        address[] voters;
        mapping(address => uint) votes;
        address winner;
    }

    address[] public votersList;
    mapping (address => bool) public voterExist;
    mapping (address => Voter) public voterData;
    
    address[] public candidateList;
    mapping (address => bool) public candidateExist;
    mapping (address => Candidate) public candidateData;

    uint[] public consituencyList;
    mapping (uint => bool) public consituencyExist;
    mapping (uint => Consituency) public consituencyData;

    constructor(uint _durationInMinutes, address _admin, string _electionName) public {
        admin = _admin;
        electionName = _electionName;
        electionStatus = true;
        electionDuration = now +(_durationInMinutes * 60); 
    }
    
    modifier onlyAdmin {
        require(admin == msg.sender, "Only admin can execute this function!");
        _;
    }
    
    // modifier isElectionActive {
    //     require(electionStatus, "Election is close");
    //     require(now < electionDuration, "Election is close");
    //     _;
    // }
    function addConsituency(uint _consituencyId, string _name) public onlyAdmin {
        require(!consituencyExist[_consituencyId], "Consituency already exist");
        consituencyExist[_consituencyId] = true;
        consituencyData[_consituencyId].consituencyId = _consituencyId;
        consituencyData[_consituencyId].name = _name;
        consituencyList.push(_consituencyId);
    }
    
    function getConsituencyIdList() public view returns(uint[]) {
        return consituencyList;
    }
   
    function addCandidate(address _candidateId, string _name, string _email, string _phoneNo, uint _consituencyId, string _party) public onlyAdmin{
        // check if admin is registering himself as candidate
        require(admin != _candidateId, "Admin can't be a candidate");
        
        // It will check if candidate is registered or not
        require(!candidateExist[_candidateId], "Candidate already exist!");
        // add candidate in candidateList
        candidateList.push(_candidateId);
            
        candidateExist[_candidateId] = true;
        candidateData[_candidateId].candidateId = _candidateId;
        candidateData[_candidateId].name = _name;
        candidateData[_candidateId].email = _email;
        candidateData[_candidateId].phoneNo = _phoneNo;
        candidateData[_candidateId].consituencyId = _consituencyId;
        candidateData[_candidateId].party = _party;
        // add candidate to its consituency
        consituencyData[_consituencyId].candidates.push(_candidateId);
    }
    
    function getCandidatesIdList() public view returns(address[]) {
        return candidateList;
    }
    
    // get candidate list enrolled in a consituency
    function getConsituencyCandidates(uint _consituencyId) public view returns(address[]) {
        return consituencyData[_consituencyId].candidates;
    }

    // get consituency of a candidate
    function getCandidateConsituency () public view returns(uint) {
        return candidateData[msg.sender].consituencyId;
    }
    
    function addVoter(address _voterId, string _name, string _email,string _phoneNo, uint _consituencyId, uint8 _age) 
        public onlyAdmin{
        // check if admin is registering himself
        require(admin != _voterId, "Admin can't be a voter");
        // It will check if voter is registered or not
        require(!voterExist[_voterId], "Voter already exist!");
        
        votersList.push(_voterId);
        
        voterExist[_voterId] = true;
        
        voterData[_voterId].voterId = _voterId;
        voterData[_voterId].name = _name;
        voterData[_voterId].email = _email;
        voterData[_voterId].phoneNo = _phoneNo;
        voterData[_voterId].consituencyId = _consituencyId;
        voterData[_voterId].age = _age;
        voterData[_voterId].voted = false;
        
        // add voter to its consituency
        consituencyData[_consituencyId].voters.push(_voterId);
    }

    function getVotersIdList() public view returns(address[]) {
        return votersList;
    }
    
    // get voters list enrolled in a consituency
    function getConsituencyVoters(uint _consituencyId) public view returns(address[]) {
        return consituencyData[_consituencyId].voters;
    }

    // get consituency of a voter
    function getVoterConsituency() public view returns(uint) {
        return voterData[msg.sender].consituencyId;
    }
    
    function castVote(uint _consituencyId, address _candidateId) public returns(bool status) {
         //election must be active
        require(electionStatus, "Election must be on/active");

        // admin can't cast a vote
        require(admin != msg.sender, "Admin can't cast a vote");

        // check if voter has voted or not
        require(!voterData[msg.sender].voted, "Voter already casted his vote");
        
        // check if candidate is of respective consituency
        if(candidateData[_candidateId].consituencyId == _consituencyId) {
            consituencyData[_consituencyId].votes[_candidateId] += 1;
            voterData[msg.sender].voted = true;
            return true;
        }else {
            return false;
        }
    }

    function getVotes(uint _consituencyId, address _candidateId) public view returns(uint) {
        return consituencyData[_consituencyId].votes[_candidateId];
    }
    function closeElection() public onlyAdmin {
        require(now > electionDuration, "Election is not completed");
        require(electionStatus, "Election is not active");
        electionStatus = false;
    }
    
}