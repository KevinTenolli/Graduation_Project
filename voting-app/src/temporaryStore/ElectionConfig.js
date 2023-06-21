import React, { useState, useEffect } from "react";
import ElectionListing from "./ElectionListing";
import Button from "@mui/material/Button";
import { Box, CssBaseline } from "@mui/material";

const ElectionConfig = ({ electionContract, account }) => {
  const [electionStarted, setElectionStarted] = useState(true);
  const [electionEnded, setElectionEnded] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const electionStatusInformation = async () => {
      if (electionContract) {
        const isElectionStarted = await electionContract.methods
          .electionStarted()
          .call();
        setElectionStarted(isElectionStarted);

        const isElectionEnded = await electionContract.methods
          .electionEnded()
          .call();
        setElectionEnded(isElectionEnded);
      }
    };

    electionStatusInformation();
  }, [electionContract]);

  const startElection = async () => {
    await electionContract.methods
      .startElection()
      .send({ from: account })
      .then(() => {
        setElectionStarted(true);
        setError("");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError("Transaction failed.");
      });
  };

  const endElection = async () => {
    await electionContract.methods
      .endElection()
      .send({ from: account })
      .then(() => {
        setElectionEnded(true);
        setError("");
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError("Transaction failed.");
      });
  };

  return (
    <div>
      <h1>Election Configuration Settings</h1>
      <Box
        sx={{
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {!electionStarted && !electionEnded && (
          <Button
            style={{ padding: "5%", margin: "1%", backgroundColor: "#88038a" }}
            variant="contained"
            onClick={startElection}
          >
            Start Election
          </Button>
        )}
        {electionStarted && !electionEnded && (
          <Button
            style={{ padding: "5%", backgroundColor: "#88038a" }}
            variant="contained"
            onClick={endElection}
          >
            End Election
          </Button>
        )}
        {electionEnded && <h1>Election has Ended</h1>}
      </Box>
      <div> {error} </div>
    </div>
  );
};

export default ElectionConfig;
