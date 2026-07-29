import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { FaCartArrowDown, FaHandsHelping } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoGiftSharp } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import "./Account.css";

export default function AccountLayout() {
  return (
    <div className="account-main">
      <div className="account-sidebar">
        <h3>My Account</h3>

        <ul>
          <li>
            <NavLink to="/orders/my-orders">
              <FaCartArrowDown /> My Orders
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders/customer-care">
              <MdOutlineSupportAgent /> Customer Care
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders/refund">
              <FaHandsHelping /> Refund
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders/update-password">
              <TbLockPassword /> Update Password
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders/gift-cards">
              <IoGiftSharp /> Gift Cards
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="account-content">
        <Outlet />
      </div>
    </div>
  );
}