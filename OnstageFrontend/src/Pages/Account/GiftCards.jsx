import React from "react";
import { useNavigate } from "react-router-dom";

export default function GiftCards() {
  const navigate = useNavigate();

  return (
    <>
      <div className="account-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span className="active">Gift Cards</span>
      </div>

      <div className="account-gift-box">
        <img
          src="https://pub-7f5e5a5587874e79bb78e418bac987b9.r2.dev/mpclive/1.png"
          alt="Gift Cards"
        />
      </div>
    </>
  );
}