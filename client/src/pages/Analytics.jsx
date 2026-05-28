import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/ai/history");
      setData(res.data.data);
    };
    fetchData();
  }, []);

  // =========================
  // BASIC METRICS
  // =========================
  const totalRequests = data.length;

  const modeCount = data.reduce((acc, item) => {
    acc[item.contentType] = (acc[item.contentType] || 0) + 1;
    return acc;
  }, {});

  // =========================
  // DAILY USAGE
  // =========================
  const dailyUsage = {};
  data.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    dailyUsage[date] = (dailyUsage[date] || 0) + 1;
  });

  const chartData = Object.keys(dailyUsage).map((date) => ({
    date,
    count: dailyUsage[date],
  }));

  // =========================
  // MODE DISTRIBUTION
  // =========================
  const pieData = Object.keys(modeCount).map((key) => ({
    name: key,
    value: modeCount[key],
  }));

  const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa"];

  // =========================
  // SIMULATED METRICS
  // =========================
  const estimatedRevenue = totalRequests * 0.5;
  const creditsUsed = totalRequests;
  const avgPerDay = chartData.length > 0 ? (totalRequests / chartData.length).toFixed(1) : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-semibold text-white">{payload[0].value} requests</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your AI usage, credits, and performance metrics.
            </p>
          </div>

          {/* TIME RANGE SELECTOR */}
          <div className="flex items-center gap-1 mt-4 sm:mt-0 bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
            {["24h", "7d", "30d", "All"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  timeRange === range
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Requests */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Requests
              </p>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">{totalRequests}</h2>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {avgPerDay} avg/day
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Revenue
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">₹{estimatedRevenue}</h2>
            <p className="text-xs text-gray-500 mt-1">Based on usage</p>
          </div>

          {/* Credits */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits Used
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">{creditsUsed}</h2>
            <div className="mt-2 w-full bg-white/[0.06] rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((creditsUsed / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Chat Mode */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chat Mode
              </p>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">{modeCount.chat || 0}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {totalRequests > 0
                ? `${((modeCount.chat || 0) / totalRequests * 100).toFixed(0)}% of total`
                : "No data"}
            </p>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* USAGE TREND - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">Usage Trend</h2>
                <p className="text-xs text-gray-500 mt-0.5">Daily request volume</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="text-xs text-gray-400">Requests</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* MODE DISTRIBUTION - Takes 1 column */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">Mode Breakdown</h2>
              <p className="text-xs text-gray-500 mt-0.5">Usage by content type</p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND */}
            <div className="space-y-2 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-gray-400 capitalize">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest AI generations</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider pb-3 pr-4">
                    Prompt
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider pb-3 pr-4">
                    Mode
                  </th>
                  <th className="text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider pb-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.slice(0, 5).map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <span className="text-sm text-gray-300 truncate block max-w-[300px]">
                        {item.prompt?.slice(0, 50)}...
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {item.contentType || "chat"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
