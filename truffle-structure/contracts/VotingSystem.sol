// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract VotingSystem {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(address => bool) public registeredVoters;
    mapping(uint => Candidate) public candidates;

    address public admin;
    uint public candidatesCount;
    bool public electionStarted;
    bool public electionEnded;

    event votedEvent(uint indexed _candidateId);

    constructor() {
        admin = msg.sender;
        electionStarted = false;
        electionEnded = false;
    }

    function addVoter(address _voter) public {
        require(msg.sender == admin, "Only admin can add a voter");
        require(!registeredVoters[_voter], "The voter is already registered");
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has been closed");

        registeredVoters[_voter] = true;
    }

    function addCandidate(string memory _name, string memory _party) public {
        require(msg.sender == admin, "Only admin can add a candidate");
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has been closed");

        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _party,
            0
        );
    }

    function editCandidate(
        uint _candidateId,
        string memory _newName,
        string memory _newParty
    ) public {
        require(msg.sender == admin, "Only admin can edit a candidate");
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has been closed");

        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );

        Candidate storage candidate = candidates[_candidateId];
        candidate.name = _newName;
        candidate.party = _newParty;
    }

    function deleteCandidate(uint _candidateId) public {
        require(msg.sender == admin, "Only admin can delete a candidate");
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has been closed");

        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );

        delete candidates[_candidateId];

        // Reassign the candidate IDs
        for (uint i = _candidateId; i < candidatesCount; i++) {
            candidates[i] = candidates[i + 1];
            candidates[i].id = i;
        }

        delete candidates[candidatesCount];
        candidatesCount--;
    }

    function startElection() public {
        require(msg.sender == admin, "Only admin can start the election");
        require(!electionStarted, "Election has already started");
        require(!electionEnded, "Election has been closed");
        electionStarted = true;
    }

    function endElection() public {
        require(msg.sender == admin, "Only admin can end the election");
        require(electionStarted, "Election has not started yet");
        electionEnded = true;
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }

    function vote(uint _candidateId) public {
        require(registeredVoters[msg.sender], "You are not a registered voter");
        require(!voters[msg.sender], "You have already voted");
        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );
        require(electionStarted && !electionEnded, "Election not in progress");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }

    function viewResults() public view returns (Candidate[] memory) {
        require(electionEnded, "Election is not yet over");
        Candidate[] memory results = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            results[i - 1] = candidates[i];
        }
        return results;
    }
}
