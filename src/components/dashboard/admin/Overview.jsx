// src/components/dashboard/admin/Overview.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getOverview } from '../../../api/services/analytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';

// Small helper to clamp chart height by breakpoint
const useChartHeights = () => {
  // Mobile: h-56, md+: h-72 (same idea as original)
  return {
    lineH: "h-56 md:h-72",
    barH: "h-56 md:h-72",
  };
};

export default function Overview() {
  // Filters
  const [range, setRange] = useState({ from: '', to: '' });
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile toggler

  // Data/UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // Only include from/to if both set (matches backend expectation)
  const params = useMemo(() => {
    if (range.from && range.to) return { from: range.from, to: range.to };
    return {};
  }, [range]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const res = await getOverview(params);
        if (!alive) return;
        setData(res);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError('Failed to load analytics');
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [params]);

  const totals = data?.totals || {};
  const status = data?.bookingsByStatus || {};
  const timeseries = data?.timeseries || [];
  const topCourses = data?.topCourses || [];
  const topWorkshops = data?.topWorkshops || [];
  const { lineH, barH } = useChartHeights();

  const reset = () => setRange({ from: '', to: '' });

  return (
    <div className="px-2 sm:px-4 md:px-6 space-y-4">
      {/* Header + filters — stack on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Analytics</h2>
          <p className="text-xs text-gray-500">Analytics & key metrics</p>
        </div>

        {/* Filters: collapsible on mobile to save vertical space */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
          <div className="sm:hidden">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="px-3 py-1 shadow rounded text-sm"
              aria-expanded={filtersOpen}
            >
              {filtersOpen ? 'Hide filters' : 'Show filters'}
            </button>
          </div>

          <div className={`w-full sm:w-auto ${filtersOpen ? 'block' : 'hidden sm:block'}`}>
            <div className="flex flex-col xs:flex-row gap-2">
              <div className="flex gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] block mb-1">From</label>
                  <input
                    type="date"
                    className="w-full shadow px-3 py-2 rounded text-sm"
                    value={range.from}
                    max={range.to || undefined}
                    onChange={(e) => setRange(r => ({ ...r, from: e.target.value }))}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[11px] block mb-1">To</label>
                  <input
                    type="date"
                    className="w-full shadow px-3 py-2 rounded text-sm"
                    value={range.to}
                    min={range.from || undefined}
                    onChange={(e) => setRange(r => ({ ...r, to: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-start sm:items-end gap-2">
                <button
                  className="px-3 py-2 shadow rounded text-sm"
                  onClick={reset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && (
        <div className="space-y-3">
          {[1,2].map(n => (
            <div key={n} className="animate-pulse bg-gray-100 rounded p-4" />
          ))}
        </div>
      )}

      {/* KPI Cards — single column on mobile, 2 on small, 4 on md+ */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard title="Total Users" value={totals.users ?? 0} />
          <KpiCard title="Total Bookings" value={totals.bookings ?? 0} />
          <KpiCard title="Revenue (est.)" value={`₵${(totals.revenue ?? 0).toLocaleString()}`} />
          <KpiCard title="Open Tickets" value={totals.ticketsOpen ?? 0} />
        </div>
      )}

      {/* Bookings by Status — chips wrap on mobile */}
      {!loading && data && (
        <div className="bg-white p-3 sm:p-4 rounded shadow">
          <div className="font-semibold mb-2 text-sm sm:text-base">Bookings by Status</div>
          <div className="flex flex-wrap gap-2 text-sm">
            {Object.keys(status).length === 0 ? (
              <div className="text-gray-500 text-sm">No data</div>
            ) : (
              Object.entries(status).map(([k, v]) => (
                <div key={k} className="px-3 py-2 shadow rounded min-w-[110px]">
                  <div className="text-[11px] text-gray-500 capitalize">{k}</div>
                  <div className="text-base font-semibold">{v}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Timeseries: Bookings & Revenue Over Time */}
      {!loading && data && (
        <div className="bg-white p-3 sm:p-4 rounded shadow">
          <div className="font-semibold mb-2 text-sm sm:text-base">Bookings & Revenue Over Time</div>
          <div className={lineH}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  interval={Math.max(0, Math.floor(timeseries.length / 8))}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="bookings" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Courses / Workshops — stack on mobile, 2 columns on md+ */}
      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-3 sm:p-4 rounded shadow">
            <div className="font-semibold mb-2 text-sm sm:text-base">Top Courses (by bookings)</div>
            <RankedBar data={topCourses} className={barH} />
          </div>
          <div className="bg-white p-3 sm:p-4 rounded shadow">
            <div className="font-semibold mb-2 text-sm sm:text-base">Top Workshops (by bookings)</div>
            <RankedBar data={topWorkshops} className={barH} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- small subcomponents ---------------- */

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded shadow flex flex-col justify-between">
      <div className="text-[11px] sm:text-xs text-gray-500">{title}</div>
      <div className="text-xl sm:text-2xl font-semibold wrap-break-word mt-2">{value}</div>
    </div>
  );
}

function RankedBar({ data, className = "" }) {
  const rows = (data || []).map(d => ({ name: d.title, value: d.bookings }));
  // If too many items, reduce labels by showing top 8 only on small screens
  const displayRows = rows.length > 12 ? rows.slice(0, 12) : rows;
  return (
    <div className={`${className || "h-56 md:h-72"} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={displayRows} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} height={48} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="value" name="Bookings" fill="#7d4c35" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
