import * as React from "react";
import { Outlet } from "react-router-dom";

export default function UserPanel() {
  return (
    <div style={{ textAlign: "center" }}>
      <Outlet />
    </div>
  );
}
