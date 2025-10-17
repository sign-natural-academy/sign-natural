// src/components/dashboard/admin/ReportsExport.jsx
import React, { useEffect, useState } from "react";
import api, { authHeaders } from "../../../lib/api";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ReportsExport() {
  const [type, setType] = useState("bookings");
  const [format, setFormat] = useState("csv");
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchReport = async () => {
    setBusy(true);
    setMsg("");
    try {
      // Primary: ask backend to build and return file
      const res = await api.get(`/api/admin/reports`, {
        headers: authHeaders(),
        params: { type, format, ...filters },
        responseType: "blob",
      });
      const ext = format === "csv" ? "csv" : "xlsx";
      downloadBlob(res.data, `${type}-report.${ext}`);
      setMsg("Report downloaded.");
    } catch (err) {
      console.error("report err", err);
      setMsg("Server failed to generate report. Trying client fallback...");
      // fallback: fetch raw JSON and build CSV locally for small datasets
      try {
        const resJson = await api.get(`/api/admin/reports/data`, { headers: authHeaders(), params: { type, ...filters } });
        const rows = resJson.data?.data ?? [];
        if (!Array.isArray(rows) || rows.length === 0) throw new Error("no data");
        // build CSV
        const keys = Object.keys(rows[0]);
        const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
        downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${type}-report.csv`);
        setMsg("Report exported (fallback).");
      } catch (e) {
        console.error(e);
        setMsg("Could not generate report.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reports & Exports</h2>
        <div className="text-sm text-gray-500">Generate CSV or Excel for bookings, users, revenue.</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs block mb-1">Report type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border px-3 py-2 rounded w-full">
              <option value="bookings">Bookings</option>
              <option value="revenue">Revenue</option>
              <option value="users">Users</option>
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="border px-3 py-2 rounded w-full">
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-xs block mb-1">From</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="text-xs block mb-1">To</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="border px-3 py-2 rounded" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={fetchReport} disabled={busy} className="px-4 py-2 bg-[#7d4c35] text-white rounded">{busy ? "Generating..." : "Generate & Download"}</button>
          <button onClick={() => { setFilters({ dateFrom: "", dateTo: "" }); setMsg(""); }} className="px-4 py-2 border rounded">Reset</button>
        </div>

        {msg && <div className="mt-3 text-sm text-gray-600">{msg}</div>}
      </div>
    </div>
  );
}
