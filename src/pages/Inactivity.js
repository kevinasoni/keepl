import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Inactivity = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    value: 30,
    unit: "days",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const token = localStorage.getItem("token");

  // 🔴 Protect route
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      setSettings({
        value: data.inactivityValue || 30,
        unit: data.inactivityUnit || "days",
      });

      setStatus(data);

    } catch (err) {
      setError("Failed to load settings");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/user/inactivity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Update failed");
      }

      setMessage("✅ Inactivity settings updated!");
      fetchSettings();

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const getTimeAgo = (date) => {
    if (!date) return "N/A";

    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Inactivity Settings</h1>

      {/* STATUS */}
      <div style={{ marginBottom: "20px" }}>
        <p>Last Active: {getTimeAgo(status?.lastActive)}</p>
        <p>
          Trigger: {status?.inactivityValue} {status?.inactivityUnit}
        </p>
        <p>
          Status:{" "}
          {status?.inactivityTriggered ? "⚠️ Email Sent" : "🟢 Active"}
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={settings.value}
          onChange={(e) =>
            setSettings({
              ...settings,
              value: parseInt(e.target.value) || 1,
            })
          }
        />

        <select
          value={settings.unit}
          onChange={(e) =>
            setSettings({
              ...settings,
              unit: e.target.value,
            })
          }
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="months">Months</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update"}
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Inactivity;