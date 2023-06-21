const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem", (accounts) => {
  let instance = null;
  const admin = accounts[0];
  const voter = accounts[1];
  const candidateName = "John Doe";
  const candidateParty = "Ethereum Party";

  before(async () => {
    instance = await VotingSystem.deployed();
  });

  it("should add a voter", async () => {
    await instance.addVoter(voter, { from: admin });
    const isVoterRegistered = await instance.registeredVoters(voter);
    assert.equal(isVoterRegistered, true, "Voter was not registered correctly");
  });

  it("should add a candidate", async () => {
    await instance.addCandidate(candidateName, candidateParty, { from: admin });
    const candidate = await instance.candidates(1);
    assert.equal(
      candidate.name,
      candidateName,
      "Candidate name was not stored correctly"
    );
    assert.equal(
      candidate.party,
      candidateParty,
      "Candidate party was not stored correctly"
    );
  });

  it("should start the election", async () => {
    await instance.startElection({ from: admin });
    const isElectionStarted = await instance.electionStarted();
    assert.equal(isElectionStarted, true, "Election was not started correctly");
  });

  it("should cast a vote", async () => {
    await instance.vote(1, { from: voter });
    const hasVoted = await instance.hasVoted(voter);
    assert.equal(hasVoted, true, "Vote was not cast correctly");
    const candidate = await instance.candidates(1);
    assert.equal(
      candidate.voteCount,
      1,
      "Vote count was not incremented correctly"
    );
  });

  it("should end the election", async () => {
    await instance.endElection({ from: admin });
    const isElectionEnded = await instance.electionEnded();
    assert.equal(isElectionEnded, true, "Election was not ended correctly");
  });

  it("should view results", async () => {
    const results = await instance.viewResults({ from: voter });
    assert.equal(
      results[0].name,
      candidateName,
      "Candidate name in results was not correct"
    );
    assert.equal(
      results[0].party,
      candidateParty,
      "Candidate party in results was not correct"
    );
    assert.equal(
      results[0].voteCount,
      1,
      "Vote count in results was not correct"
    );
  });
});
