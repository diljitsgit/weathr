import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Component from "./chart";
import { ChangeEvent, useEffect, useState } from "react";
import { apiData, suggestionsData } from "./lib/types";
import { WEEKDAY } from "./lib/constants";
import { useUserCoords } from "./lib/hooks";
import { getWeatherData } from "./lib/fetchWeatherData";
import {
    presChartData,
    tempChartData,
    weatherCodeConversion,
    windChartData,
} from "./lib/utils";
import { getLocationData } from "./lib/axios";
import Daily from "./components/ui/DailyData";
import Suggestions from "./components/ui/LocationSuggestions";

function Weather() {
    const userCoords = useUserCoords();
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [weatherData, setWeatherData] = useState<apiData>(null);
    const [location, setLocation] = useState("");
    const [locationData, setLocationData] = useState<suggestionsData>(null);
    const [permissionGiven, setPermissionGiven] = useState(false);

    const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: suggestionsData = await getLocationData(location);
                setLocationData(data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchData();

        return;
    }, [location]);

    function suggestionSelected(lat: number, long: number) {
        setLat(lat);
        setLong(long);
        setLocation("");
    }

    useEffect(() => {
        if (userCoords && !permissionGiven) {
            setLat(userCoords.lat);
            setLong(userCoords.long);
        }
    }, [userCoords]);

    const handleClick = () => {
        setLocation("");
        setPermissionGiven(true);
    };

    function handleData(data: apiData, lat: number, long: number) {
        if (lat != 0 && long != 0) {
            setWeatherData(data);
            setPermissionGiven(true);
        }
    }

    useEffect(() => {
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
    }, [lat, long]);

    return (
        <>
            {permissionGiven && weatherData ? (
                <>
                    <div>
                        <div>
                            <div className="flex items-center gap-2 my-2 overflow-x-scroll md:overflow-hidden">
                                <div>
                                    <input
                                        className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                                        type="text"
                                        name="location"
                                        value={location}
                                        onChange={handleLocationChange}
                                        placeholder="enter city..."
                                    />
                                    <Suggestions
                                        data={locationData}
                                        functionDrill={suggestionSelected}
                                    ></Suggestions>
                                </div>
                                <button
                                    onClick={handleClick}
                                    className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="flex justify-between items-center font-info">
                                <div className="flex items-baseline">
                                    <div className="flex gap-3 items-baseline">
                                        <img
                                            src={
                                                "/src/assets/weather-icons/" +
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
                                            WEEKDAY[
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
                                            chartData={tempChartData(
                                                weatherData
                                            )}
                                            chartColor={"#3E5EFF"}
                                        ></Component>
                                    </div>
                                </TabsContent>
                                <TabsContent value="precipatation">
                                    <div className="my-6">
                                        <Component
                                            chartData={presChartData(
                                                weatherData
                                            )}
                                            chartColor={"#E59061"}
                                        ></Component>
                                    </div>
                                </TabsContent>
                                <TabsContent value="wind">
                                    <div className="my-6">
                                        <Component
                                            chartData={windChartData(
                                                weatherData
                                            )}
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
                <div className="flex items-center gap-2 my-2 overflow-x-scroll md:overflow-hidden">
                    <div>
                        <input
                            className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                            type="text"
                            name="location"
                            value={location}
                            onChange={handleLocationChange}
                            placeholder="enter city..."
                        />
                        <Suggestions
                            data={locationData}
                            functionDrill={suggestionSelected}
                        ></Suggestions>
                    </div>
                    <button
                        onClick={handleClick}
                        className="px-3 py-1 bg-transparent text-black dark:text-white rounded-md border-[1px] border-outline lg:rounded-xl md:rounded-lg focus:outline-none"
                    >
                        Clear
                    </button>
                </div>
            )}
        </>
    );
}

export default Weather;
