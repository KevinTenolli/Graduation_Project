const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem - Edge Cases", async (accounts) => {
  let contract;

  beforeEach(async () => {
    contract = await VotingSystem.new({ from: accounts[0] });
  });

  it("Cannot add the same voter twice", async () => {
    await contract.addVoter(accounts[1], { from: accounts[0] });
    try {
      await contract.addVoter(accounts[1], { from: accounts[0] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Expected 'revert', got '" + error + "' instead"
      );
    }
  });

  it("Cannot vote when election has not started", async () => {
    await contract.addCandidate("Candidate 1", "Party 1", {
      from: accounts[0],
    });
    await contract.addVoter(accounts[1], { from: accounts[0] });
    try {
      await contract.vote(1, { from: accounts[1] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Expected 'revert', got '" + error + "' instead"
      );
    }
  });

  it("Cannot vote for a non-existent candidate", async () => {
    await contract.addVoter(accounts[1], { from: accounts[0] });
    try {
      await contract.vote(999, { from: accounts[1] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Expected 'revert', got '" + error + "' instead"
      );
    }
  });

  it("Cannot add a candidate when election has started", async () => {
    await contract.startElection({ from: accounts[0] });
    try {
      await contract.addCandidate("Candidate 2", "Party 2", {
        from: accounts[0],
      });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Expected 'revert', got '" + error + "' instead"
      );
    }
  });

  it("Cannot vote after election has ended", async () => {
    await contract.addCandidate("Candidate 1", "Party 1", {
      from: accounts[0],
    });
    await contract.addVoter(accounts[1], { from: accounts[0] });
    await contract.startElection({ from: accounts[0] });
    await contract.endElection({ from: accounts[0] });
    try {
      await contract.vote(1, { from: accounts[1] });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Expected 'revert', got '" + error + "' instead"
      );
    }
  });
});
