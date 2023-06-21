import * as React from 'react';
import {Outlet} from "react-router-dom";
import Button from "@mui/material/Button";

export default function AdminPanel() {
    return (
        <div style={{textAlign: "center"}}>
            <br/>
            <Outlet/>
        </div>
    )
};