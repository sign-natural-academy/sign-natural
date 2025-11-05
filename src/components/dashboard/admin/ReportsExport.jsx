// src/components/dashboard/admin/ReportsExport.jsx
import React, { useCallback, useMemo, useState } from "react";
import { downloadReport } from "../../../api/services/reports";

// --- Utilities ---
const normalizeDateStr = (s) => (s || "").trim();

const validRange = (from, to) => {
  if (!from && !to) return true;                 // allow empty range
  if ((from && !to) || (!from && to)) return false;
  return from <= to;                              // YYYY-MM-DD compares lexicographically
};

export default function ReportsExport() {
  // Supported backend routes:
  // GET /api/reports/bookings.csv?from=&to=
  // GET /api/reports/testimonials.csv?from=&to=
  // GET /api/reports/courses.csv
  // GET /api/reports/workshops.csv
  const [type, setType] = useState("bookings");
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const from = normalizeDateStr(filters.from);
  const to = normalizeDateStr(filters.to);
  const dateRangeValid = useMemo(() => validRange(from, to), [from, to]);

  // Only include from/to if both are present (matches backend expectation)
  const params = useMemo(() => (from && to ? { from, to } : {}), [from, to]);

  const setFrom = useCallback((v) => {
    setFilters((prev) => {
      // If "from" goes beyond current "to", clear "to" to avoid invalid ranges
      if (prev.to && v && v > prev.to) return { from: v, to: "" };
      return { ...prev, from: v };
    });
  }, []);

  const setTo = useCallback((v) => setFilters((p) => ({ ...p, to: v })), []);

  const reset = useCallback(() => {
    setFilters({ from: "", to: "" });
    setMsg("");
    setIsError(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (busy) return; // double-click protection
    setBusy(true);
    setMsg("");
    setIsError(false);

    if (!dateRangeValid) {
      setBusy(false);
      setIsError(true);
      setMsg("Invalid date range. Ensure From ≤ To or clear both dates.");
      return;
    }

    try {
      // Conforms to services/reports.js — pass "bookings" | "testimonials" | "courses" | "workshops"
      // Service will normalize to `/reports/<type>.csv` and handle CSV/HTML guard.
      await downloadReport(type, params, `${type}-${Date.now()}.csv`);
      setMsg("Report downloaded.");
    } catch (e) {
      console.error(e);
      setIsError(true);
      setMsg("Could not generate report.");
    } finally {
      setBusy(false);
    }
  }, [busy, dateRangeValid, params, type]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleDownload();
      }
    },
    [handleDownload]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reports & Exports</h2>
        <div className="text-sm text-gray-500">
          Generate CSV for bookings, testimonials, courses, workshops.
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow" onKeyDown={onKeyDown}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs block mb-1">Report type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="bookings">Bookings</option>
              <option value="testimonials">Testimonials</option>
              <option value="courses">Courses</option>
              <option value="workshops">Workshops</option>
            </select>
          </div>

          {/* Format fixed to CSV to match backend .csv routes */}
          <div>
            <label className="text-xs block mb-1">Format</label>
            <select
              value="csv"
              disabled
              className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-600"
            >
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div>
              <label className="text-xs block mb-1">From</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFrom(e.target.value)}
                className="border px-3 py-2 rounded"
                // Keep native calendar UI; min/max guide valid selections
                max={filters.to || undefined}
              />
            </div>
            <div>
              <label className="text-xs block mb-1">To</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setTo(e.target.value)}
                className="border px-3 py-2 rounded"
                min={filters.from || undefined}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={busy || !dateRangeValid}
            className="px-4 py-2 bg-[#7d4c35] text-white rounded disabled:opacity-60"
          >
            {busy ? "Generating..." : "Generate & Download"}
          </button>
          <button onClick={reset} className="px-4 py-2 border rounded">
            Reset
          </button>
        </div>

        {msg && (
          <div className={`mt-3 text-sm ${isError ? "text-red-600" : "text-gray-600"}`}>
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
