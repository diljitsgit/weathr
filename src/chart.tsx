"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
// const chartData = [
//     { time: "12:00", temp: 33 },
//     { time: "13:00", temp: 30 },
//     { time: "14:00", temp: 35 },
//     { time: "15:00", temp: 20 },
//     { time: "16:00", temp: 32 },
//     { time: "17:00", temp: 21 },
//     { time: "12:00", temp: 33 },
//     { time: "13:00", temp: 30 },
//     { time: "14:00", temp: 35 },
//     { time: "15:00", temp: 20 },
//     { time: "16:00", temp: 32 },
//     { time: "17:00", temp: 21 },
//     { time: "12:00", temp: 33 },
//     { time: "13:00", temp: 30 },
//     { time: "14:00", temp: 35 },
//     { time: "15:00", temp: 20 },
//     { time: "16:00", temp: 32 },
//     { time: "17:00", temp: 21 },
//     { time: "12:00", temp: 33 },
//     { time: "13:00", temp: 30 },
//     { time: "14:00", temp: 35 },
//     { time: "15:00", temp: 20 },
//     { time: "16:00", temp: 32 },
//     { time: "17:00", temp: 21 },
// ];

type ChartProps = {
    chartData: {
        time: string;
        temp: number;
    }[];
};

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function Component({ chartData }: ChartProps) {
    return (
        <ChartContainer config={chartConfig} className="max-h-44">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 0,
                    right: 0,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={true}
                    tickMargin={10}
                    tickFormatter={(value) => value}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={0}
                    tickCount={4}
                />
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="temp"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.8}
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    );
}
