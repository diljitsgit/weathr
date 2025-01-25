import { apiData } from "./lib/types";
import { weatherCodeConversion } from "./lib/utils";

export default function CurrentTemprature({
    weatherData,
}: {
    weatherData: apiData;
}) {
    if (weatherData) {
        return (
            <>
                <div className="flex items-baseline">
                    <div className="flex gap-3 items-baseline">
                        <img
                            src={
                                "/src/assets/weather-icons/" +
                                weatherCodeConversion(
                                    weatherData.current.weatherCode
                                ) +
                                ".svg"
                            }
                            alt="a icon should be here"
                            className="size-12"
                        />
                        <p className="text-[4rem] text-black dark:text-white">
                            {Math.floor(weatherData.current.temperature2m)}°
                        </p>
                    </div>
                </div>
            </>
        );
    }
}
