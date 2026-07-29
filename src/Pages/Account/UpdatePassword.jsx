import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const getUserEmail = () => {
    try {
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("userData")) ||
        null;

      return user?.email || user?.user?.email || "";
    } catch {
      return "";
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const email = getUserEmail();

      const bodyData = {
        password: oldPassword,
        newPassword,
      };

      if (email) bodyData.email = email;

      const response = await fetch(
        "https://api.onstage.co.in/api/v1/change-password",
        {
          method: "POST",
          credentials: "include",
          headers: authHeaders(),
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Password change failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <div className="account-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span>
        <span> / </span>
        <span className="active">Update Password</span>
      </div>

      <div className="change-password-box">
        <div className="change-password-head">
          <TbLockPassword className="change-password-main-icon" />
          <div>
            <h2>Update Password</h2>
            <p>Enter your old password and create a new password.</p>
          </div>
        </div>

        <form className="change-password-form" onSubmit={handleChangePassword}>
          <div className="change-password-input-box">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <span onClick={() => setShowOldPassword(!showOldPassword)}>
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="change-password-input-box">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <span onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="change-password-input-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="change-password-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
}