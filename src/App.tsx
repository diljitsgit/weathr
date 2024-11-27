"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Component from "./chart";
import { fetchWeatherApi } from "openmeteo";

//Types

type NavbarProps = {
    changeThemeDrill: () => void;
    setTimeZone: Dispatch<SetStateAction<string>>;
};

type LocationData = {
    asn: string;
    city: string;
    continent_code: string;
    country: string;
    country_area: number;
    country_calling_code: string;
    country_capital: string;
    country_code: string;
    country_code_iso3: string;
    country_name: string;
    country_population: number;
    country_tld: string;
    currency: string;
    currency_name: string;
    in_eu: boolean;
    ip: string;
    languages: string;
    latitude: number;
    longitude: number;
    network: string;
    org: string;
    postal: string;
    region: string;
    region_code: string;
    timezone: string;
    utc_offset: string;
    version: string;
};

//Variables
let hour: number;

//Location API Call
let UserLocation: LocationData = {
    asn: "AS24186",
    city: "New Delhi",
    continent_code: "AS",
    country: "IN",
    country_area: 3287590,
    country_calling_code: "+91",
    country_capital: "New Delhi",
    country_code: "IN",
    country_code_iso3: "IND",
    country_name: "India",
    country_population: 1352617328,
    country_tld: ".in",
    currency: "INR",
    currency_name: "Rupee",
    in_eu: false,
    ip: "36.255.14.130",
    languages:
        "en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc",
    latitude: 28.652,
    longitude: 77.1663,
    network: "36.255.14.0/23",
    org: "RailTel Corporation of India Ltd",
    postal: "110020",
    region: "National Capital Territory of Delhi",
    region_code: "DL",
    timezone: "Asia/Kolkata",
    utc_offset: "+0530",
    version: "IPv4",
};
const getApproxLocation = async () => {
    const res = await fetch("https://ipapi.co/json/");
    UserLocation = await res.json();
};
await getApproxLocation();

console.log(UserLocation);

//Timezone API Call
let timezones: string[];
const getTimezoneData = async () => {
    const res = await fetch(
        "https://timeapi.io/api/timezone/availabletimezones"
    );
    timezones = await res.json();
};
await getTimezoneData();

//Wheather API Call
const params = {
    latitude: UserLocation.latitude,
    longitude: UserLocation.longitude,
    hourly: ["temperature_2m", "weather_code"],
    forecast_days: 2,
};
const urlWheather = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(urlWheather, params);
const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
const response = responses[0];
const utcOffsetSeconds = response.utcOffsetSeconds();
const hourly = response.hourly()!;
const weatherData = {
    hourly: {
        time: range(
            Number(hourly.time()),
            Number(hourly.timeEnd()),
            hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        weatherCode: hourly.variables(1)!.valuesArray()!,
    },
};
console.log(weatherData);

//APP Component
function App() {
    const [theme, setTheme] = useState("dark");

    function changeTheme() {
        if (theme == "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    }

    const [currTimezone, setCurrTimezone] = useState(timezones[0]);

    return (
        <>
            <div className={theme}>
                <div className="bg-lbackground dark:bg-dbackground w-screen h-screen overflow-hidden">
                    <Navbar
                        changeThemeDrill={changeTheme}
                        setTimeZone={setCurrTimezone}
                    ></Navbar>
                    <div className="flex w-screen justify-between items-center px-40 py-20">
                        <HeroSection passTimezone={currTimezone}></HeroSection>
                    </div>
                </div>
            </div>
        </>
    );
}

function Navbar({ changeThemeDrill, setTimeZone }: NavbarProps) {
    return (
        <>
            <div className="block w-screen h-[50px] bg-background px-10 border-b-[1px] border-outline">
                <div className="flex justify-between items-center h-[50px]">
                    <h1 className="text-black dark:text-white font-logo font-extrabold text-2xl">
                        WEATHR
                    </h1>

                    <select
                        onClick={(e) => {
                            setTimeZone((e.target as HTMLInputElement).value);
                        }}
                        name="timezones"
                        className="bg-lbackground border dark:border-white border-black text-black text-sm rounded-md font-info focus:ring-primary focus:border-primary block w-1/6 px-2 py-1 dark:bg-dbackground dark:text-white"
                    >
                        <option value="Select">Select a timezone</option>
                        {timezones.map(function (data: string) {
                            return (
                                <option
                                    key={"timezone" + data}
                                    className="rounded-lg"
                                >
                                    {data.toUpperCase()}
                                </option>
                            );
                        })}
                    </select>

                    <div className="flex gap-3 justify-between items-center">
                        <Toggle click={changeThemeDrill}></Toggle>
                        <img
                            src="/src/assets/github-mark-white.svg"
                            alt="Github Icon"
                            className="size-5 invert dark:invert-0"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

function Toggle({ click }: { click: () => void }) {
    return (
        <>
            <>
                <button
                    type="button"
                    className="hidden font-medium rounded-full text-slate-50 hover:bg-primary transition ease-in-out duration-500 dark:block"
                    onClick={click}
                >
                    <span className="group inline-flex shrink-0 justify-center items-center size-9">
                        <svg
                            className="shrink-0 size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </span>
                </button>
                <button
                    type="button"
                    className="block dark:hidden font-medium rounded-full text-slate-50 hover:bg-primary transition ease-in-out duration-500"
                    onClick={click}
                >
                    <span className="group inline-flex shrink-0 justify-center items-center size-9 invert">
                        <svg
                            className="shrink-0 size-5"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx={12} cy={12} r={4} />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    </span>
                </button>
            </>
        </>
    );
}

function HeroSection({ passTimezone }: { passTimezone: string }) {
    const chartData = makeChartData(hour);

    return (
        <>
            <div className="px-20 py-10 bg-background border-[1px] border-outline rounded-3xl flex-1 text-white flex flex-col justify-between max-h-[60vh]">
                <div className="flex flex-row justify-between">
                    <div className="leftInfo">
                        <TimeData timezone={passTimezone}></TimeData>
                    </div>
                    <div className="rightInfo flex-1">
                        <div className="text-right flex flex-row-reverse">
                            <h2 className="text-7xl font-semibold text-black dark:text-white flex flex-row items-baseline py-4">
                                {Math.floor(
                                    weatherData.hourly.temperature2m[hour]
                                )}
                                <span>°C</span>
                                <span className="text-[#3D3D3D]">/°F</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col pt-8">
                    <div className="min-w-max flex flex-row justify-between items-center ml-16 mb-2">
                        <WeatherIconData></WeatherIconData>
                    </div>
                    <Component chartData={chartData}></Component> {/*Chart*/}
                </div>
            </div>
        </>
    );
}

function TimeData({ timezone }: { timezone: string }) {
    interface TimeData {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        seconds: number;
        milliSeconds: number;
        dateTime: string;
        date: string;
        time: string;
        timeZone: string;
        dayOfWeek: string;
        dstActive: boolean;
    }

    const [data, setData] = useState<TimeData>({
        year: 2024,
        month: 11,
        day: 22,
        hour: 20,
        minute: 57,
        seconds: 7,
        milliSeconds: 57,
        dateTime: "2024-11-22T20:57:07.0570538",
        date: "11/22/2024",
        time: "20:57",
        timeZone: "Europe/Amsterdam",
        dayOfWeek: "Friday",
        dstActive: false,
    });

    useEffect(() => {
        const urlTime =
            "https://timeapi.io/api/time/current/zone?timeZone=" +
            timezone.replace("/", "%2F");

        const fetchInfo = () => {
            return fetch(urlTime)
                .then((res) => res.json())
                .then((d) => setData(d));
        };

        fetchInfo();
        const interval = setInterval(() => {
            fetchInfo();
        }, 1000);

        return () => clearInterval(interval);
    }, [timezone]);
    hour = data.hour;

    const suffix = getDaySuffix(data.day);

    return (
        <>
            <div className="flex flex-row gap-2">
                <div>
                    <h5 className="font-info text-[#3D3D3D] text-base">
                        {data.day}
                        {suffix} {getMonth(data.month)}{" "}
                        {data.dayOfWeek.toUpperCase()}
                    </h5>
                    <h2 className="text-7xl font-semibold text-black dark:text-white flex flex-row items-baseline">
                        {data.time}
                        <span className="font-info text-[#3D3D3D] text-xs font-normal flex items-end cursor-pointer">
                            CONVERT
                            <img
                                src="/src/assets/loop.png"
                                alt="Convert Icon"
                                className="size-3 -rotate-45 dark:invert my-1 mx-1 dark:opacity-50"
                            />
                        </span>
                    </h2>
                </div>
                <img
                    src={calcIconUrl(weatherData.hourly.weatherCode[hour])}
                    alt="rain Icon"
                    className="size-28"
                ></img>
            </div>
        </>
    );
}

function WeatherIconData() {
    const data: number[] = Array.from(weatherData.hourly.weatherCode);
    return (
        <>
            {data.map((item, index) => {
                if (index >= hour && index < hour + 24) {
                    const iconUrl: string = calcIconUrl(item);
                    return <img src={iconUrl} key={index} />;
                }
            })}
        </>
    );
}

function makeChartData(hour: number) {
    const tempData = Array.from(weatherData.hourly.temperature2m);

    let copy = hour;

    const obj = [];

    for (let i = 0; i < 24; i++) {
        copy++;
        if (copy == 24) copy = 0;
        console.log(copy);
        const temp = {
            time: copy + ":00",
            temp: Math.floor(tempData[hour + i]),
        };
        obj.push(temp);
    }

    return obj;
}

function getDaySuffix(day: number): string {
    if (day % 10 == 1) {
        return "ST";
    } else if (day % 10 == 2) {
        return "ND";
    } else if (day % 10 == 3) {
        return "RD";
    } else {
        return "TH";
    }
}

function getMonth(month: number): string {
    switch (month) {
        case 1:
            return "JAN";
        case 2:
            return "FEB";
        case 3:
            return "MAR";
        case 4:
            return "APR";
        case 5:
            return "MAY";
        case 6:
            return "JUN";
        case 7:
            return "JUL";
        case 8:
            return "AUG";
        case 9:
            return "SEP";
        case 10:
            return "OCT";
        case 11:
            return "NOV";
        case 12:
            return "DEC";
        default:
            return "";
    }
}

function calcIconUrl(item: number): string {
    if (item >= 0 && item < 50) {
        return "/src/assets/OverCast.svg";
    } else if (item >= 50 && item < 60) {
        return "/src/assets/Humid.svg";
    } else if (item >= 60 && item < 90) {
        return "/src/assets/Rain.svg";
    } else if (item >= 95 && item < 99) {
        return "/src/assets/Thunder.svg";
    } else {
        return "/src/assets/Sunny.svg";
    }
}

export default App;
