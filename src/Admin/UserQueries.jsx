import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaSearch,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { MdMessage, MdSubject } from "react-icons/md";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const BASE_URL = "https://api.onstage.co.in/api/v1";
const RESOLVED_KEY = "resolvedUserQueries";
const DELETE_AFTER = 24 * 60 * 60 * 1000;

export default function UserQueries() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [resolvedQueries, setResolvedQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const getQueryId = (item) => item?._id || item?.id;

  useEffect(() => {
    loadResolvedQueries();
    fetchUserQueries();
  }, []);

  const loadResolvedQueries = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(RESOLVED_KEY)) || [];

      const valid = saved.filter(
        (item) => Date.now() - item.resolvedAt < DELETE_AFTER
      );

      localStorage.setItem(RESOLVED_KEY, JSON.stringify(valid));
      setResolvedQueries(valid);
    } catch {
      localStorage.removeItem(RESOLVED_KEY);
      setResolvedQueries([]);
    }
  };

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const list = activeFilter === "active" ? queries : resolvedQueries;

    const filtered = list.filter((item) =>
      `${item.firstName || ""} ${item.lastName || ""} ${item.email || ""} ${
        item.subject || ""
      } ${item.message || ""}`
        .toLowerCase()
        .includes(search)
    );

    setFilteredQueries(filtered);
  }, [searchTerm, queries, resolvedQueries, activeFilter]);

  const fetchUserQueries = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/userQuery`, {
        method: "GET",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await res.json();

      if (res.ok && data.success === true) {
        const apiQueries = data.queries || data.data || data.userQueries || [];

        const savedResolved =
          JSON.parse(localStorage.getItem(RESOLVED_KEY)) || [];

        const validResolved = savedResolved.filter(
          (item) => Date.now() - item.resolvedAt < DELETE_AFTER
        );

        localStorage.setItem(RESOLVED_KEY, JSON.stringify(validResolved));
        setResolvedQueries(validResolved);

        const activeQueries = apiQueries.filter((item) => {
          const id = getQueryId(item);
          return !validResolved.some((r) => getQueryId(r) === id);
        });

        setQueries(activeQueries);
      } else {
        setQueries([]);
      }
    } catch (error) {
      console.log("User Queries Error:", error);
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const saveResolvedQuery = (item, queryId) => {
    const resolvedItem = {
      ...item,
      resolvedAt: Date.now(),
    };

    setQueries((prev) => prev.filter((q) => getQueryId(q) !== queryId));

    const oldResolved = JSON.parse(localStorage.getItem(RESOLVED_KEY)) || [];

    const updatedResolved = [
      resolvedItem,
      ...oldResolved.filter((r) => getQueryId(r) !== queryId),
    ];

    localStorage.setItem(RESOLVED_KEY, JSON.stringify(updatedResolved));
    setResolvedQueries(updatedResolved);
    setActiveFilter("resolved");
  };

  const handleResolve = async (item) => {
    const queryId = getQueryId(item);

    if (!queryId) {
      Swal.fire({
        title: "ID Not Found!",
        text: "Query ID not found.",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Resolve Query?",
      text: "This query will be moved to resolved queries.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Resolve",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(queryId);

      const res = await fetch(`${BASE_URL}/delete-contact-query/${queryId}`, {
        method: "DELETE",
        credentials: "include",
        headers: authHeaders(),
      });

      const data = await res.json();

      console.log("Delete Status:", res.status);
      console.log("Delete Response:", data);

      if (res.ok && data.success === true) {
        saveResolvedQuery(item, queryId);

        Swal.fire({
          title: "Resolved!",
          text: data.message || "Query resolved successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Failed!",
          text: data.message || "Query resolve failed.",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Delete Query Error:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="uq-page">
      <div className="uq-header">
        <div>
          <h1>User Queries</h1>
          <p className="adm-subtitle">View and manage customer queries.</p>
        </div>

        <div className="uq-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="uq-tabs">
        <button
          className={activeFilter === "active" ? "active" : ""}
          onClick={() => setActiveFilter("active")}
        >
          Active Queries
        </button>

        <button
          className={activeFilter === "resolved" ? "active" : ""}
          onClick={() => setActiveFilter("resolved")}
        >
          Resolved
        </button>
      </div>

      {loading ? (
        <div className="uq-state-box">Loading queries...</div>
      ) : filteredQueries.length === 0 ? (
        <div className="uq-state-box">No user queries found.</div>
      ) : (
        <div className="uq-grid">
          {filteredQueries.map((item, index) => {
            const queryId = getQueryId(item);

            return (
              <div className="uq-card" key={queryId || index}>
                <div className="uq-card-top">
                  <div className="uq-avatar">
                    <FaUser />
                  </div>

                  <div>
                    <h3>
                      {item.firstName || "Unknown"} {item.lastName || ""}
                    </h3>
                    <span>Query #{index + 1}</span>
                  </div>
                </div>

                <div className="uq-info">
                  <p>
                    <FaEnvelope />
                    <span>{item.email || "No email"}</span>
                  </p>

                  <p>
                    <MdSubject />
                    <span>{item.subject || "No subject"}</span>
                  </p>

                  <p className="uq-message">
                    <MdMessage />
                    <span>{item.message || "No message found"}</span>
                  </p>
                </div>

                <div className="uq-footer">
                  <span>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-IN")
                      : "No date"}
                  </span>

                  {activeFilter === "active" ? (
                    <button
                      className="uq-resolve-btn"
                      disabled={deletingId === queryId}
                      onClick={() => handleResolve(item)}
                    >
                      <FaCheckCircle />
                      {deletingId === queryId ? "Resolving..." : "Resolve"}
                    </button>
                  ) : (
                    <span className="uq-resolved-badge">
                      <FaClock />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}