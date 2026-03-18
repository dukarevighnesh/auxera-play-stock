import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { generateChartData } from "@/lib/stockData";

interface MiniChartProps {
  basePrice: number;
  isUp: boolean;
}

const MiniChart = ({ basePrice, isUp }: MiniChartProps) => {
  const data = useMemo(() => generateChartData(basePrice, 20), [basePrice]);
  const color = isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${isUp}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#gradient-${isUp})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniChart;
