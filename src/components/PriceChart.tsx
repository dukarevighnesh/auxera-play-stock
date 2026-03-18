import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { generateChartData } from "@/lib/stockData";

interface PriceChartProps {
  basePrice: number;
  symbol: string;
}

const periods = ["1D", "1W", "1M", "3M", "1Y"] as const;

const PriceChart = ({ basePrice, symbol }: PriceChartProps) => {
  const [period, setPeriod] = useState<typeof periods[number]>("1D");
  const pointsMap = { "1D": 48, "1W": 7 * 24, "1M": 30, "3M": 90, "1Y": 365 };
  const data = useMemo(
    () => generateChartData(basePrice, pointsMap[period]),
    [basePrice, period]
  );

  const isUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const color = isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";

  return (
    <div className="bg-card rounded-lg p-4 shadow-soft-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-label">{symbol} Price Chart</h3>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                period === p
                  ? "bg-brand/20 text-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 10 }}
            width={60}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 7%)",
              border: "1px solid hsl(217, 19%, 27%)",
              borderRadius: "4px",
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
            }}
            labelStyle={{ color: "hsl(215, 20%, 65%)" }}
            itemStyle={{ color: "hsl(210, 40%, 98%)" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#chartGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
