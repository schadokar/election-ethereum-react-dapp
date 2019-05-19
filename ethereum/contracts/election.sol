pragma solidity ^0.4.25;

contract ElectionFactory {
    
    address[] public electionConducted;
    
    event ElectionEvent(address _admin, address _electionAddress);
    
    function createElection (uint _durationInMinutes) public {
        address newElection = new Election(_durationInMinutes, msg.sender);
        electionConducted.push(newElection);
        emit ElectionEvent(msg.sender, newElection);
    }
    
    function getElections() public view returns(address[] _conductedElection) {
        return electionConducted;
    }
}

contract Election {
    address public admin;
    
    bool electionStatus;
    
    uint electionDuration;

    struct Voter {
        address voterId;
        string name;
        string email;
        string phoneNo;
        bytes32 consituency;
        uint8 age;
        bool voted;
    }
    
    struct Candidate {
        address candidateId;
        string name;
        string email;
        string phoneNo;
        bytes32 consituency;
    }
    
    struct Consituency {
        bytes32 consituencyId;
        address[] candidateCount;
        uint8 voterCount;
    }

    Voter[] public votersList;
    mapping (address => bool) public voterExist;
    mapping (address => Voter) public voterData;
    
    Candidate[] public candidateList;
    mapping (address => bool) public candidateExist;
    mapping (address => Candidate) public candidateData;

    Consituency[] public consituencyList;
    mapping (bytes32 => bool) public consituencyExist;
    mapping (bytes32 => Consituency) public consituencyData;
    mapping (bytes32 => mapping (address => uint)) public consituencyCandidateVotes;

    constructor(uint _durationInMinutes, address _admin) public {
        admin = _admin;
        electionStatus = true;
        electionDuration = now +(_durationInMinutes * 60); 
    }
    
    modifier onlyAdmin {
        require(admin == msg.sender, "Only admin can execute this function!");
        _;
    }
    
    function addConsituency(bytes32 _consituencyId) public onlyAdmin {
        require(!consituencyExist[_consituencyId], "consituency already exist");
        consituencyExist[_consituencyId] = true;
        
        Consituency memory consituency = Consituency(_consituencyId, new address[](0), 0);
        consituencyList.push(consituency);
        consituencyData[_consituencyId] = consituencyList[consituencyList.length - 1];
    }

    function getConsituencyList() public view returns(uint) {
        return consituencyList.length;
    }
    
    function addVoter(address _voterId, string _name, string _email,string _phoneNo, bytes32 _consituency, uint8 _age) 
        public onlyAdmin returns (bool exist){
        // check if admin is registering himself
        require(admin != _voterId, "Admin can't be a voter");
        // It will check if voter is registered or not
        if(!voterExist[_voterId]) {
            votersList.push(Voter({
                voterId : _voterId,
                name : _name,
                email : _email,
                phoneNo : _phoneNo,
                consituency : _consituency,
                age : _age,
                voted : false
            }));
        
            voterExist[_voterId] = true;
            voterData[_voterId] = votersList[votersList.length - 1];
            
            consituencyData[_consituency].voterCount += 1;

            return true;
        }
        else {
            return false;
        }
    }

    function addCandidate(address _candidateId, string _name, string _email, string _phoneNo, bytes32 _consituency) public onlyAdmin returns(bool exist) {
        // check if admin is registering himself as candidate
        require(admin != _candidateId, "Admin can't be a candidate");
        
        // It will check if candidate is registered or not
        if(!candidateExist[_candidateId]) {
            
            // add candidate in candidateList
            candidateList.push(Candidate({
                candidateId:_candidateId,
                name : _name,
                email : _email,
                phoneNo : _phoneNo,
                consituency : _consituency
            }));
            
            candidateExist[_candidateId] = true;
            candidateData[_candidateId] = candidateList[candidateList.length - 1];
            // map Candidate to its consituency
            consituencyData[_consituency].candidateCount.push(_candidateId); 
            consituencyCandidateVotes[_consituency][_candidateId] = 0; 
            return true;
        }
        else {
            return false;
        }
    }

     function castVote(address _candidateId) public {
        //election must be active
        require(electionStatus, "Election must be on/active");

        // admin can't cast a vote
        require(admin != msg.sender, "Admin can't cast a vote");

        Voter memory voter = voterData[msg.sender];
        // check if voter has voted or not
        require(!voter.voted, "voter already casted his vote");
        
        bytes32 voterConsituency = voter.consituency;
        consituencyCandidateVotes[voterConsituency][_candidateId] += 1;
        
        voter.voted = true;   
    }

     function closeElection() public onlyAdmin {
        require(now > electionDuration, "Election is not completed");
        require(electionStatus, "Election is not active");
        electionStatus = false;
    }

    function winnerOfElection() public view onlyAdmin returns(address[] _winners) {
        require(!electionStatus, "Election is active");
        address[] memory winners = new address[](consituencyList.length - 1);
         for(uint i =0; i< consituencyList.length; i++) {
            uint maxVoteCandidate = 0;
            address candidate;
            Consituency memory consituency = consituencyList[i];
            for(uint j = 0; j < consituency.candidateCount.length ; j++) {
                uint votes = consituencyCandidateVotes[consituency.consituencyId][consituency.candidateCount[j]];
                if(maxVoteCandidate < votes) {
                    maxVoteCandidate = votes;
                    candidate = consituency.candidateCount[j];
                }
            }
            winners[i]= candidate;
        }
        return winners;
    }
}