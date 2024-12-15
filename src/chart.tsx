"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type ChartProps = {
    chartData: {
        time: string;
        temp: number;
    }[];
    chartColor: string;
};

export default function Component({ chartData, chartColor }: ChartProps) {
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: chartColor,
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="max-h-44">
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 15,
                    right: 15,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="time"
                    tickLine={true}
                    axisLine={false}
                    tickMargin={4}
                    tickFormatter={(value) => value}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
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
