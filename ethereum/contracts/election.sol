pragma solidity ^0.4.25;

contract Election {
    
    address public admin;
    
    mapping (bytes32 => mapping (address => uint)) public consituencyCandidateList;
    
    Voter[] public votersList;
    mapping (address => bool) public voterExist;
    mapping (address => Voter) public voterData;
    
    Candidate[] public candidateList;
    mapping (address => bool) public candidateExist;
    mapping (address => Candidate) public candidateData;
    
    mapping (address => bool) public voterStatus;
    
    struct Voter {
        address voterId;
        string name;
        string email;
        string phoneNo;
        bytes32 consituency;
        uint8 age;
    }
    
    struct Candidate {
        address candidateId;
        string name;
        string email;
        string phoneNo;
        bytes32 consituency;
    }
    
    constructor() public {
        admin = msg.sender;
    }
    
    modifier onlyAdmin {
        require(admin == msg.sender, "Only admin can do this transaction");
        _;
    }
    
    function addVoter(address _voterId, string _name, string _email,string _phoneNo, bytes32 _consituency, uint8 _age) 
        public onlyAdmin returns (bool exist){
        // check if admin is registering himself
        require(admin != _voterId, "admin can't be the voter");
        // It will check if voter is registered or not
        if(!voterExist[_voterId]) {
            votersList.push(Voter({
                voterId : _voterId,
                name : _name,
                email : _email,
                phoneNo : _phoneNo,
                consituency : _consituency,
                age : _age
            }));
        
            voterExist[_voterId] = true;
            voterData[_voterId] = votersList[votersList.length - 1];
            
            return true;
        }
        else {
            return false;
        }
    }
    
    function addCandidate(address _candidateId, string _name, string _email, string _phoneNo, bytes32 _consituency) public onlyAdmin returns(bool exist) {
        // check if admin is registering himself as candidate
        require(admin != _candidateId);
        
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
            consituencyCandidateList[_consituency][_candidateId] = 0; 
            
            return true;
        }
        else {
            return false;
        }
    }
    
    function castVote(address _candidateId) public {
        // admin can't cast a vote
        require(admin != msg.sender);
        
        // check if voter has voted or not
        require(!voterStatus[msg.sender]);
        bytes32 voterConsituency = voterData[msg.sender].consituency;
        consituencyCandidateList[voterConsituency][_candidateId] += 1;
    }
}