import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import Button from "@mui/material/Button";

export default function Vote({ electionContract, account }) {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [electionStarted, setElectionStarted] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);
  const handleCandidateChange = (event) => {
    setSelectedCandidate(event.target.value);
  };

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

        if (isElectionStarted && !isElectionEnded) {
          const hasVoterVoted = await electionContract.methods
            .hasVoted(account)
            .call();
          console.log(hasVoterVoted);
          setHasVoted(hasVoterVoted);
          const candidatesCount = await electionContract.methods
            .candidatesCount()
            .call();
          let candidates = [];

          for (let i = 1; i <= candidatesCount; i++) {
            let candidate = await electionContract.methods.candidates(i).call();
            candidates.push(candidate);
          }
          setCandidates(candidates);
        }
      }
    };

    electionStatusInformation();
  }, [electionContract]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await electionContract.methods
      .vote(selectedCandidate)
      .send({ from: account })
      .then(() => {
        setHasVoted(true);
      })
      .catch((err) => {
        console.log(err?.message);
      });
  };

  return (
    <>
      <h2>Vote for your candidate.</h2>
      {!electionStarted ? (
        <h3>Election has not started yet.</h3>
      ) : electionStarted && electionEnded ? (
        <h3>
          Election has ended. Go to results panel to check out the results of
          the election
        </h3>
      ) : hasVoted ? (
        <div>A vote has been casted by your account. You cannot vote twice</div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormGroup>
                    <RadioGroup
                      name="candidate"
                      value={selectedCandidate}
                      onChange={handleCandidateChange}
                    >
                      {candidates.map((candidate) => (
                        <FormControlLabel
                          key={candidate.id}
                          value={`${candidate.id}`}
                          control={<Radio />}
                          label={`${candidate.name} (Party : ${candidate.party})`}
                        />
                      ))}
                    </RadioGroup>
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#88038a" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </>
  );
}
