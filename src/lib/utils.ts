import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RANGE } from "./constants";
import { apiData } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function weatherCodeConversion(a: number): string {
    if (a >= 0 && a <= 3) {
        return "Cloudy";
    } else if ((a >= 4 && a <= 12) || a == 28 || (a >= 40 && a <= 49)) {
        return "Fog";
    } else if (a == 13) {
        return "Rain-ThunderStorm";
    } else if (a >= 15 && a <= 16) {
        return "Humidity";
    } else if ((a >= 17 && a <= 19) || a == 29 || (a >= 95 && a <= 99)) {
        return "Severe-ThunderStorm";
    } else if ((a >= 50 && a <= 59) || a == 20) {
        return "Drizzle";
    } else if (
        (a >= 24 && a <= 25) ||
        a == 21 ||
        (a >= 60 && a <= 69) ||
        (a >= 80 && a <= 84)
    ) {
        return "Rain";
    } else if (a == 26 || (a >= 70 && a <= 79) || (a >= 85 && a <= 86)) {
        return "Snow";
    } else if (a == 27 || (a >= 87 && a <= 94)) {
        return "Hail";
    } else if (a >= 30 && a <= 35) {
        return "Wind";
    } else if (a >= 36 && a <= 39) {
        return "Blowing-Snow";
    }

    return "Unknown";
}

export const tempChartData = (weatherData: apiData) => {
    const out = [];
    if (weatherData) {
        for (
            let i = weatherData.current.time.getHours();
            i < weatherData.current.time.getHours() + RANGE;
            i++
        ) {
            const temp = {
                time: (i % 24) + ":00",
                temp: Math.floor(weatherData.hourly.temperature2m[i]),
            };
            out.push(temp);
        }
    }
    return out;
};

export const presChartData = (weatherData: apiData) => {
    const out = [];
    if (weatherData) {
        for (
            let i = weatherData.current.time.getHours();
            i < weatherData.current.time.getHours() + RANGE;
            i++
        ) {
            const temp = {
                time: (i % 24) + ":00",
                temp: Math.floor(weatherData.hourly.precipitation[i]),
            };
            out.push(temp);
        }
    }
    return out;
};

export const windChartData = (weatherData: apiData) => {
    const out = [];
    if (weatherData) {
        for (
            let i = weatherData.current.time.getHours();
            i < weatherData.current.time.getHours() + RANGE;
            i++
        ) {
            const temp = {
                time: (i % 24) + ":00",
                temp: Math.floor(weatherData.hourly.windSpeed10m[i]),
            };
            out.push(temp);
        }
    }
    return out;
};
