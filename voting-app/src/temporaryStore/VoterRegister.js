import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

const VoterRegister = ({ electionContract, account }) => {
  const [electionStarted, setElectionStarted] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [error, setError] = useState("");
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(voterId);

  useEffect(() => {
    const electionStatusInformation = async () => {
      if (electionContract) {
        const isElectionStarted = await electionContract.methods
          .electionStarted()
          .call();
        setElectionStarted(isElectionStarted);
      }
    };

    electionStatusInformation();
  }, [electionContract]);

  const handleChange = (event) => {
    setVoterId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const regex = new RegExp("^0x[a-fA-F0-9]{40}$");
    if (regex.test(voterId)) {
      electionContract.methods
        .addVoter(voterId)
        .send({ from: account })
        .catch((error) => {
          console.error("There was an error!", error);
          setError("Transaction failed.");
        });
      setVoterId("");
      setError("");
    } else {
      setError("Invalid voter ID");
    }
  };

  return (
    <div>
      <h1>Register Voter:</h1>
      <br />
      <br />
      {electionStarted ? (
        <h2>Election has started. No more voters can be added.</h2>
      ) : (
        <>
          <TextField
            id="id"
            label="VoterID"
            variant="standard"
            required
            value={voterId}
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button
            variant="contained"
            style={{ margin: "0 5%"}}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default VoterRegister;
