import React from "react";
import { Outlet } from "react-router-dom";
import MainSideNav from "./MainSideNav";

const Layout = ({ isAdmin, account }) => {
  return (
    <div>
      <MainSideNav isAdmin={isAdmin} account={account} />
      <Outlet />
    </div>
  );
};

export default Layout;
