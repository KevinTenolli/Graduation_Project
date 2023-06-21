import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./temporaryStore/AdminPanel";
import UserPanel from "./temporaryStore/UserPanel";
import Layout from "./temporaryStore/Layout";
import NotFound from "./temporaryStore/NotFound";
import ElectionConfig from "./temporaryStore/ElectionConfig";
import { Home } from "@mui/icons-material";
import CandidateList from "./temporaryStore/CandidateList";
import VoterRegister from "./temporaryStore/VoterRegister";
import Results from "./temporaryStore/Results";
import Vote from "./temporaryStore/Vote";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import VotingSystem from "./abis/VotingSystem.json";
import "./App.css";

function App() {
  const adminAccount = "0x8e9701Ada0F761F08cE6553DF76F0db9EAfcc5eF"; //admin account address, change according to the address that deployed the contract
  const [electionContract, setElectionContract] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    const loadBlockchainData = async () => {
      try {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setAccount(account);
        const networkId = await web3.eth.net.getId();
        const electionData = VotingSystem.networks[networkId];
        if (electionData) {
          const election = new web3.eth.Contract(
            VotingSystem.abi,
            electionData.address
          );
          setElectionContract(election);
          if (account === adminAccount) {
            setIsAdmin(true);
            navigate("/admin");
          } else if (account) {
            navigate("/voter");
          }
        } else {
          alert("wallet not connected");
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadWeb3();
    loadBlockchainData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout isAdmin={isAdmin} account={account} />}>
        <Route path="home" element={<Home />} />
        {account && isAdmin ? (
          <Route path="admin" element={<AdminPanel />}>
            <Route
              path="election"
              element={
                <ElectionConfig
                  electionContract={electionContract}
                  account={account}
                />
              }
            />
            <Route
              path="candidate"
              element={
                <CandidateList
                  electionContract={electionContract}
                  account={account}
                />
              }
            />
            <Route
              path="registerVoter"
              element={
                <VoterRegister
                  electionContract={electionContract}
                  account={account}
                />
              }
            />
          </Route>
        ) : account && !isAdmin ? (
          <Route path="voter" element={<UserPanel />}>
            <Route
              path="vote"
              element={
                <Vote electionContract={electionContract} account={account} />
              }
            />
          </Route>
        ) : null}
        <Route
          path="result"
          element={
            <Results electionContract={electionContract} account={account} />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
