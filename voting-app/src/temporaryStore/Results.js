import React, {useEffect, useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {DataGrid} from '@mui/x-data-grid';
import Grid from "@mui/material/Grid";

export default function Results({electionContract, account}) {
    const [results, setResults] = useState([]);
    const [electionEnded, setElectionEnded] = useState(false);
    const candidateColumns = [
        {field: 'id', headerName: 'ID', width: 90},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'party', headerName: 'Party', width: 150},
        {field: 'voteCount', headerName: 'Vote Count', width: 180},
    ];
    const electionStatusInformation = async () => {
        if (electionContract) {
            const isElectionEnded = await electionContract.methods
                .electionEnded()
                .call();
            setElectionEnded(isElectionEnded);
        }
    };
    useEffect(() => {
        const getResults = async () => {
            if (electionContract) {
                let response = await electionContract.methods.viewResults().call();
                let results = [];
                for (let candidate of response) {
                    const resultObject = {
                        id: Number(candidate["id"]),
                        name: candidate["name"],
                        party: candidate["party"],
                        voteCount: Number(candidate["voteCount"])
                    };
                    results.push(resultObject);
                }
                setResults(results);
            }
        };
        electionStatusInformation().catch(err => {
            console.log("The election has not started nor ended");
        });
        getResults().catch(err => {
            console.log("The election has not started nor ended");
        });
    }, [electionContract]);

    const sortedByCandidateCount = [...results].sort((a, b) => b.candidateCount - a.candidateCount);
    return (
        <div style={{textAlign: "center"}} className={"result"}>
            <h1>Results of election</h1>
            <br/>
            {electionEnded ? (
                <div style={{margin: "0 7%"}}>
                    <div style={{height: 100, width: '100%', textAlign: "center"}}>
                        <Grid container spacing={3} columns={16}>
                            <Grid item xs={6}>
                                <h2>Rankings by Candidate Count</h2>
                                <DataGrid rows={sortedByCandidateCount} columns={candidateColumns}/>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{margin: "38% auto"}}>
                                    <BarChart width={500} height={300} data={results}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="voteCount" fill="#8884d8" name="Candidate Count"/>
                                    </BarChart>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
