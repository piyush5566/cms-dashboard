"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/app/lib/utils";
import { Revenue } from "@/app/lib/definitions";

export default function RevenueChartClient({
  revenue,
}: {
  revenue: Revenue[];
}) {
  // Format data for Recharts
  const chartData = revenue.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6B7280" }}
          tickLine={{ stroke: "#6B7280" }}
        />
        <YAxis
          tick={{ fill: "#6B7280" }}
          tickLine={{ stroke: "#6B7280" }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value as number)}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
          }}
        />
        <Bar
          dataKey="revenue"
          fill="#60A5FA"
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
