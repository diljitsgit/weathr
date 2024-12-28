import { WEEKDAY } from "@/lib/constants";
import { apiData } from "@/lib/types";
import { weatherCodeConversion } from "@/lib/utils";

export default function CurrentTemprature({
    weatherData,
}: {
    weatherData: apiData;
}) {
    if (weatherData) {
        return (
            <>
                <div className="text-right flex flex-col">
                    <h4 className="text-lg text-black dark:text-white leading-6">
                        Weather
                    </h4>
                    <p className="text-grayTxt text-sm leading-3">
                        {WEEKDAY[weatherData.current.time.getDay()]},{" "}
                        {weatherData.current.time.getHours()}
                        :00
                    </p>
                    <p className="text-grayTxt text-sm leading-4">
                        {weatherCodeConversion(
                            weatherData.current.weatherCode
                        ).replace("-", " ")}
                    </p>
                </div>
            </>
        );
    }
}
