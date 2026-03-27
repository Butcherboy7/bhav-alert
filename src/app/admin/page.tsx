"use client";

import React, { useState } from "react";

const COMMODITIES = [
  { key: "petrol", label: "Petrol", needsCity: true },
  { key: "diesel", label: "Diesel", needsCity: true },
  { key: "gold.price_24k", label: "Gold 24K", needsCity: false },
  { key: "gold.price_22k", label: "Gold 22K", needsCity: false },
  { key: "lpg.price", label: "LPG", needsCity: false },
  { key: "onion.price", label: "Onion", needsCity: false },
  { key: "rice.price", label: "Rice", needsCity: false },
  { key: "milk.price", label: "Milk", needsCity: false },
];

const CITIES = ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "kolkata", "pune", "ahmedabad", "jaipur", "lucknow"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [commodity, setCommodity] = useState("petrol");
  const [city, setCity] = useState("mumbai");
  const [newPrice, setNewPrice] = useState("");
  const [changeVal, setChangeVal] = useState("0");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCommodity = COMMODITIES.find((c) => c.key === commodity);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleSubmit = async () => {
    if (!newPrice) return;
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/admin/update-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          commodity,
          city: selectedCommodity?.needsCity ? city : undefined,
          price: Number(newPrice),
          change: Number(changeVal),
        }),
      });

      const data = await res.json();
      setStatus(data.success ? "✅ Price updated successfully!" : `❌ ${data.error}`);
    } catch {
      setStatus("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-black text-gray-800 text-center">🔐 Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-black text-gray-800">🔧 Quick Price Update</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
          >
            {COMMODITIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          {selectedCommodity?.needsCity && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold capitalize"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="New price (₹)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
          />

          <input
            type="number"
            value={changeVal}
            onChange={(e) => setChangeVal(e.target.value)}
            placeholder="Change from yesterday (₹)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Price"}
          </button>

          {status && (
            <p className="text-center text-sm font-bold">{status}</p>
          )}
        </div>

        <a href="/" className="block text-center text-orange-600 font-bold text-sm hover:underline">
          ← Back to App
        </a>
      </div>
    </div>
  );
}
