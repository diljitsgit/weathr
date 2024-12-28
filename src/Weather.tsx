import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Component from "./chart";
import { ChangeEvent, useEffect, useState } from "react";
import { apiData, suggestionsData } from "./lib/types";
import { useUserCoords } from "./lib/hooks";
import { getWeatherData } from "./lib/fetchWeatherData";
import { presChartData, tempChartData, windChartData } from "./lib/utils";
import { getLocationData } from "./lib/axios";
import Daily from "./components/ui/DailyData";
import Suggestions from "./components/ui/LocationSuggestions";
import Input from "./components/ui/Input";
import Button from "./components/ui/Button";
import CurrentTemprature from "./components/ui/CurrentTemprature";
import CurrentWeather from "./components/ui/CurrentWeather";

function Weather() {
    const userCoords = useUserCoords();
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [weatherData, setWeatherData] = useState<apiData>(null);
    const [location, setLocation] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
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
    }, [location]);

    function suggestionSelected(lat: number, long: number) {
        setLat(lat);
        setLong(long);
        setLocation("");
        if (locationData) {
            setCurrentLocation(location);
        }
    }
    useEffect(() => {
        if (userCoords && !permissionGiven) {
            setLat(userCoords.lat);
            setLong(userCoords.long);
        }
    }, [permissionGiven, userCoords]);

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
                    <div className="my-2 overflow-x-scroll md:overflow-hidden">
                        <Input
                            value={location}
                            onChange={handleLocationChange}
                            placeHolder="enter city...."
                        ></Input>
                        <Suggestions
                            data={locationData}
                            functionDrill={suggestionSelected}
                        ></Suggestions>
                        <Button onClick={handleClick}>Clear</Button>
                    </div>

                    <div className="flex justify-between items-center font-info">
                        <CurrentTemprature
                            weatherData={weatherData}
                        ></CurrentTemprature>
                        <CurrentWeather
                            weatherData={weatherData}
                            location={currentLocation}
                        ></CurrentWeather>
                    </div>
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
                            <Component
                                chartData={tempChartData(weatherData)}
                                chartColor={"#3E5EFF"}
                            ></Component>
                        </TabsContent>
                        <TabsContent value="precipatation">
                            <Component
                                chartData={presChartData(weatherData)}
                                chartColor={"#E59061"}
                            ></Component>
                        </TabsContent>
                        <TabsContent value="wind">
                            <Component
                                chartData={windChartData(weatherData)}
                                chartColor={"#95B6F6"}
                            ></Component>
                        </TabsContent>
                    </Tabs>
                    <Daily weatherData={weatherData}></Daily>
                </>
            ) : (
                <div className="flex items-center gap-2 my-2 overflow-x-scroll md:overflow-hidden">
                    <Input
                        value={location}
                        onChange={handleLocationChange}
                        placeHolder="enter city...."
                    ></Input>
                    <Suggestions
                        data={locationData}
                        functionDrill={suggestionSelected}
                    ></Suggestions>
                    <Button onClick={handleClick}>Clear</Button>
                </div>
            )}
        </>
    );
}

export default Weather;
