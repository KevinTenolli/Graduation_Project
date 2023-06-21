import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "./Modal/Modal";
import { FormGroup, FormControl, TextField, Box } from "@mui/material";

const CandidateList = ({ electionContract, account }) => {
  const [show, setShow] = useState(false);
  const [electionStarted, setElectionStarted] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);
  const [candidate, setCandidate] = useState({
    name: "",
    party: "",
  });

  const [candidates, setCandidates] = useState([]);

  const handleCloseModal = () => {
    setShow(false);
  };

  const isFormValid = candidate.name !== "" && candidate.party !== "";
  const handleDelete = async (id) => {
    await electionContract.methods
      .deleteCandidate(id)
      .send({ from: account })
      .then(() => {
        getCandidateLists();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleModalChange = (event) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleChange = (event, id) => {
    const { name, value } = event.target;
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, [name]: value } : candidate
      )
    );
  };
  const getCandidateLists = async () => {
    if (electionContract) {
      const candidatesCount = await electionContract.methods
        .candidatesCount()
        .call();
      let candidates = [];

      for (let i = 1; i <= candidatesCount; i++) {
        let candidate = await electionContract.methods.candidates(i).call();
        const candidateObject = {
          id: i,
          name: candidate["name"],
          party: candidate["party"],
        };
        candidates.push(candidateObject);
      }
      setCandidates(candidates);
    }
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
      }
    };
    electionStatusInformation();
    getCandidateLists();
  }, [electionContract]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await electionContract.methods
      .addCandidate(candidate.name, candidate.party)
      .send({ from: account })
      .then(() => {
        handleCloseModal();
        setCandidate({ name: "", party: "" });
        getCandidateLists();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "party", headerName: "Party", width: 130 },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={async () => await handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const rows = [{ id: 1, name: "John Cena", party: "Socialiste" }];
  return (
    <div>
      <h2>Candidate List</h2>
      {!electionStarted && !electionEnded ? (
        <>
          <Button
            style={{
              margin: "1% auto 1% 23%",
              borderColor: "#88038a",
              color: "#88038a",
            }}
            variant="outlined"
            onClick={() => setShow(true)}
          >
            Create Candidate
          </Button>
          <Modal
            title="Create Candidate"
            onClose={() => setShow(false)}
            show={show}
          >
            <form style={{ textAlign: "center" }} onSubmit={handleSubmit}>
              <FormControl>
                <FormGroup>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1,
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    <TextField
                      id="name"
                      name="name"
                      label="Name"
                      value={candidate.name}
                      style={{ margin: "2%" }}
                      onChange={handleModalChange}
                    />
                    <TextField
                      id="party"
                      name="party"
                      label="Party"
                      value={candidate.party}
                      style={{ margin: "2%" }}
                      onChange={handleModalChange}
                    />
                  </Box>
                  <Button
                    type="submit"
                    style={{
                      padding: "2%",
                      margin: "3%",
                      backgroundColor: "#88038a",
                    }}
                    variant="contained"
                    disabled={!isFormValid}
                  >
                    Submit
                  </Button>
                </FormGroup>
              </FormControl>
            </form>
          </Modal>
          <div
            style={{
              height: 400,
              width: "35%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <br />
            {candidates.length !== 0 ? (
              <DataGrid
                columns={columns}
                rows={candidates}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            ) : (
              <div>No candidates</div>
            )}
          </div>
        </>
      ) : electionStarted ? (
        <div>Election has started, cannot add or remove candidates</div>
      ) : electionEnded ? (
        <div>Election has ended, cannot add or remove candidates</div>
      ) : null}
    </div>
  );
};

export default CandidateList;
