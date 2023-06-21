const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem Integration", (accounts) => {
  let instance = null;
  const admin = accounts[0];
  const voter = accounts[1];
  const candidateName = "John Doe";
  const candidateParty = "Ethereum Party";

  beforeEach(async () => {
    instance = await VotingSystem.new({ from: admin });
  });

  it("should register a voter, add a candidate, start the election, vote and then end the election", async () => {
    await instance.addVoter(voter, { from: admin });
    const isVoterRegistered = await instance.registeredVoters(voter);
    assert.isTrue(isVoterRegistered, "Voter was not registered correctly");

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
    await instance.startElection({ from: admin });
    const isElectionStarted = await instance.electionStarted();
    assert.isTrue(isElectionStarted, "Election was not started correctly");

    await instance.vote(1, { from: voter });
    const hasVoted = await instance.hasVoted(voter);
    assert.isTrue(hasVoted, "Vote was not cast correctly");
    const updatedCandidate = await instance.candidates(1);
    assert.equal(
      updatedCandidate.voteCount,
      1,
      "Vote count was not incremented correctly"
    );

    await instance.endElection({ from: admin });
    const isElectionEnded = await instance.electionEnded();
    assert.isTrue(isElectionEnded, "Election was not ended correctly");
  });
});
