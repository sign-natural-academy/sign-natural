// src/components/dashboard/admin/Overview.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getOverview } from '../../../api/services/analytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';

export default function Overview() {
  // Filters
  const [range, setRange] = useState({ from: '', to: '' });     // 1
  // Data + UI
  const [loading, setLoading] = useState(true);                 // 2
  const [error, setError] = useState('');                       // 3
  const [data, setData] = useState(null);                       // 4

  // Build params only if both dates set
  const params = useMemo(() => {
    if (range.from && range.to) return { from: range.from, to: range.to }; // 5
    return {};
  }, [range]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const res = await getOverview(params);                  // 6
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

  const totals = data?.totals || {};                            // 7
  const status = data?.bookingsByStatus || {};                  // 8
  const timeseries = data?.timeseries || [];                    // 9
  const topCourses = data?.topCourses || [];                    // 10
  const topWorkshops = data?.topWorkshops || [];                // 11

  const reset = () => setRange({ from: '', to: '' });           // 12

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="flex gap-2 items-end">
          <div>
            <label className="text-xs block mb-1">From</label>
            <input
              type="date"
              className="border px-3 py-2 rounded"
              value={range.from}
              max={range.to || undefined}
              onChange={(e) => setRange(r => ({ ...r, from: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs block mb-1">To</label>
            <input
              type="date"
              className="border px-3 py-2 rounded"
              value={range.to}
              min={range.from || undefined}
              onChange={(e) => setRange(r => ({ ...r, to: e.target.value }))}
            />
          </div>
          <button className="px-3 py-2 border rounded" onClick={reset}>Reset</button>
        </div>
      </div>

      {/* Status */}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div className="text-gray-600 text-sm">Loading…</div>}

      {/* KPI Cards */}
      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="Total Users" value={totals.users ?? 0} />
          <KpiCard title="Total Bookings" value={totals.bookings ?? 0} />
          <KpiCard title="Revenue (est.)" value={`₵${(totals.revenue ?? 0).toLocaleString()}`} />
          <KpiCard title="Open Tickets" value={totals.ticketsOpen ?? 0} />
        </div>
      )}

      {/* Bookings by Status */}
      {!loading && data && (
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Bookings by Status</div>
          <div className="flex gap-4 text-sm">
            {Object.keys(status).length === 0 ? (
              <div className="text-gray-500">No data</div>
            ) : (
              Object.entries(status).map(([k, v]) => (
                <div key={k} className="px-3 py-2 border rounded">
                  <div className="text-xs text-gray-500 capitalize">{k}</div>
                  <div className="text-base font-semibold">{v}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Timeseries: Bookings & Revenue */}
      {!loading && data && (
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Bookings & Revenue Over Time</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Courses / Workshops */}
      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="font-semibold mb-2">Top Courses (by bookings)</div>
            <RankedBar data={topCourses} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="font-semibold mb-2">Top Workshops (by bookings)</div>
            <RankedBar data={topWorkshops} />
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function RankedBar({ data }) {
  // 13 shape for recharts: [{ name, value }]
  const rows = (data || []).map(d => ({ name: d.title, value: d.bookings }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Bookings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
