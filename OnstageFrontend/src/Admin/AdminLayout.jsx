import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaOpencart, FaCloudUploadAlt, FaEdit } from "react-icons/fa";
import { GiAquarius } from "react-icons/gi";
import { RiRefund2Fill } from "react-icons/ri";
import { LuListOrdered } from "react-icons/lu";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="adm-wrapper">
      <div className="adm-container">
        <div className="adm-sidebar">
          <div className="adm-logo">
            <img
              src="https://pub-1cfbd62bb18344a08190c13684f63517.r2.dev/274/logo%20(1).png"
              alt="logo"
            />
          </div>

          <ul>
            <li>
              <NavLink to="/admin/dashboard">
                <MdDashboard />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/orders">
                <FaOpencart />
                <span>Orders</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/upload-file">
                <FaCloudUploadAlt />
                <span>Upload File</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/user-queries">
                <GiAquarius />
                <span>User Queries</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/update-orders">
                <LuListOrdered />
                <span>Update Orders</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/refunded-order">
                <RiRefund2Fill />
                <span>Refund Orders</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="adm-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}