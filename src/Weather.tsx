import { fetchWeatherApi } from "openmeteo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Component from "./chart";
import { ChangeEvent, useEffect, useState } from "react";

let permissionGiven = false;

type apiData = {
    current: {
        time: Date;
        temperature2m: number;
        relativeHumidity2m: number;
        precipitation: number;
        weatherCode: number;
        windSpeed10m: number;
    };
    hourly: {
        time: Date[];
        temperature2m: Float32Array;
        precipitation: Float32Array;
        weatherCode: Float32Array;
        windSpeed10m: Float32Array;
        windDirection10m: Float32Array;
    };
    daily: {
        weatherCode: Float32Array;
        temperature2mMax: Float32Array;
        temperature2mMin: Float32Array;
    };
} | null;

type coordDataType = {
    lat: number;
    long: number;
};

const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

async function getWeatherData(lat: number, long: number) {
    const params = {
        latitude: lat,
        longitude: long,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
        ],
        hourly: [
            "temperature_2m",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
        ],
        daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
        );

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            relativeHumidity2m: current.variables(1)!.value(),
            precipitation: current.variables(2)!.value(),
            weatherCode: current.variables(3)!.value(),
            windSpeed10m: current.variables(4)!.value(),
        },
        hourly: {
            time: range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            precipitation: hourly.variables(1)!.valuesArray()!,
            weatherCode: hourly.variables(2)!.valuesArray()!,
            windSpeed10m: hourly.variables(3)!.valuesArray()!,
            windDirection10m: hourly.variables(4)!.valuesArray()!,
        },
        daily: {
            time: range(
                Number(daily.time()),
                Number(daily.timeEnd()),
                daily.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            weatherCode: daily.variables(0)!.valuesArray()!,
            temperature2mMax: daily.variables(1)!.valuesArray()!,
            temperature2mMin: daily.variables(2)!.valuesArray()!,
        },
    };

    return weatherData;
}

function weatherCodeConversion(a: number): string {
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

const useUserCoords = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    return {
        lat: latitude,
        long: longitude,
    };
};

function Weather() {
    const userCoords = useUserCoords();
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const range = 24;
    const [weatherData, setWeatherData] = useState<apiData>(null);
    const [coordData, setCoordData] = useState<coordDataType>({
        lat: 0,
        long: 0,
    });

    const handleCoordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCoordData({
            ...coordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleClick = () => {
        setLat(coordData.lat);
        setLong(coordData.long);
        console.log(userCoords);
    };

    function handleData(data: apiData, lat: number, long: number) {
        if (lat != 0 && long != 0) {
            setWeatherData(data);
            permissionGiven = true;
        }
    }

    useEffect(() => {
        setLat(userCoords.lat);
        setLong(userCoords.long);
        const fetchData = async () => {
            try {
                const data: apiData = await getWeatherData(lat, long);
                handleData(data, lat, long);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchData();

        return;
    }, [lat, long, userCoords.lat, userCoords.long]);

    const tempChartData = () => {
        const out = [];
        if (weatherData) {
            for (
                let i = weatherData.current.time.getHours();
                i < weatherData.current.time.getHours() + range;
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

    const presChartData = () => {
        const out = [];
        if (weatherData) {
            for (
                let i = weatherData.current.time.getHours();
                i < weatherData.current.time.getHours() + range;
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

    const windChartData = () => {
        const out = [];
        if (weatherData) {
            for (
                let i = weatherData.current.time.getHours();
                i < weatherData.current.time.getHours() + range;
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

    return (
        <>
            {permissionGiven && weatherData ? (
                <>
                    <div>
                        <div>
                            <div className="flex items-center gap-2 overflow-x-scroll md:overflow-hidden">
                                <input
                                    className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                                    type="text"
                                    name="lat"
                                    onChange={handleCoordChange}
                                    placeholder="latitude..."
                                />
                                <input
                                    className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                                    type="text"
                                    name="long"
                                    onChange={handleCoordChange}
                                    placeholder="longitude..."
                                />
                                <button
                                    onClick={handleClick}
                                    className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="flex justify-between items-center font-info">
                                <div className="flex items-baseline">
                                    <div className="flex gap-3 items-baseline">
                                        <img
                                            src={
                                                "/src/assets/new-icons/" +
                                                weatherCodeConversion(
                                                    weatherData.current
                                                        .weatherCode
                                                ) +
                                                ".svg"
                                            }
                                            alt="a icon should be here"
                                            className="size-12"
                                        />
                                        <p className="text-[4rem] text-black dark:text-white">
                                            {Math.floor(
                                                weatherData.current
                                                    .temperature2m
                                            )}
                                            °
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col">
                                    <h4 className="text-lg text-black dark:text-white leading-6">
                                        Weather
                                    </h4>
                                    <p className="text-grayTxt text-sm leading-3">
                                        {
                                            weekday[
                                                weatherData.current.time.getDay()
                                            ]
                                        }
                                        , {weatherData.current.time.getHours()}
                                        :00
                                    </p>
                                    <p className="text-grayTxt text-sm leading-4">
                                        {weatherCodeConversion(
                                            weatherData.current.weatherCode
                                        ).replace("-", " ")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="block">
                            <Tabs defaultValue="temprature" className="flex-1">
                                <TabsList>
                                    <TabsTrigger value="temprature">
                                        Temprature
                                    </TabsTrigger>
                                    <TabsTrigger value="precipatation">
                                        Precipitation
                                    </TabsTrigger>
                                    <TabsTrigger value="wind">Wind</TabsTrigger>
                                </TabsList>
                                <TabsContent value="temprature">
                                    <div className="my-6">
                                        <Component
                                            chartData={tempChartData()}
                                            chartColor={"#3E5EFF"}
                                        ></Component>
                                    </div>
                                </TabsContent>
                                <TabsContent value="precipatation">
                                    <div className="my-6">
                                        <Component
                                            chartData={presChartData()}
                                            chartColor={"#E59061"}
                                        ></Component>
                                    </div>
                                </TabsContent>
                                <TabsContent value="wind">
                                    <div className="my-6">
                                        <Component
                                            chartData={windChartData()}
                                            chartColor={"#95B6F6"}
                                        ></Component>
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="overflow-scroll md:overflow-hidden">
                                <div className="flex md:justify-center">
                                    <div className="flex gap-2">
                                        <Daily
                                            weatherData={weatherData}
                                        ></Daily>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>Loading</>
            )}
        </>
    );
}

function Daily({ weatherData }: { weatherData: apiData }) {
    const dailyData = () => {
        const out = [];
        if (weatherData) {
            for (let i = 0; i < 7; i++) {
                const temp = {
                    day: weekday[(weatherData.current.time.getDate() + i) % 7],
                    weatherCode: weatherData.daily.weatherCode[i],
                    minTemp: weatherData.daily.temperature2mMin[i],
                    maxTemp: weatherData.daily.temperature2mMax[i],
                };
                out.push(temp);
            }
        }
        return out;
    };

    return (
        <>
            {dailyData().map((a) => {
                return (
                    <div
                        key={a.day}
                        className="flex flex-col min-w-max border-[1px] border-outline rounded-xl lg:rounded-3xl md:rounded-2xl justify-between items-center px-3 py-2"
                    >
                        <p className="text-lg text-black dark:text-white">
                            {a.day.slice(0, 3)}
                        </p>
                        <img
                            src={
                                "/src/assets/new-icons/" +
                                weatherCodeConversion(a.weatherCode) +
                                ".svg"
                            }
                            alt="There should be a icon here"
                            className="size-12 mb-2"
                        />
                        <div>
                            <p className="text-sm text-grayTxt leading-3">
                                {Math.floor(a.maxTemp)}°
                            </p>
                            <p className="text-sm text-grayTxt">
                                {Math.floor(a.minTemp)}°
                            </p>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default Weather;
