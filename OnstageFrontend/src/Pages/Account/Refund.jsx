import React from "react";
import { useNavigate } from "react-router-dom";

export default function Refund() {
  const navigate = useNavigate();

  return (
    <>
      <div className="account-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span className="active">Refund</span>
      </div>

      <div className="account-empty-page">
        <h2>Refund / Return</h2>
        <p>Refund and return details will appear here.</p>
      </div>
    </>
  );
}