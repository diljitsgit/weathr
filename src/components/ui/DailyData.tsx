import { WEEKDAY } from "@/lib/constants";
import { apiData } from "@/lib/types";
import { weatherCodeConversion } from "@/lib/utils";

export default function Daily({ weatherData }: { weatherData: apiData }) {
    const dailyData = () => {
        const out = [];
        if (weatherData) {
            for (let i = 0; i < 7; i++) {
                const temp = {
                    day: WEEKDAY[(weatherData.current.time.getDate() + i) % 7],
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
            <div className="overflow-scroll md:overflow-hidden">
                <div className="flex md:justify-center">
                    <div className="flex gap-2">
                        {dailyData().map((a) => {
                            return (
                                <div
                                    key={a.day}
                                    className="flex flex-col min-w-max border-[1px] border-outline rounded-xl md:rounded-2xl justify-between items-center px-3 py-2"
                                >
                                    <p className="text-lg text-black dark:text-white">
                                        {a.day.slice(0, 3)}
                                    </p>
                                    <img
                                        src={
                                            "/src/assets/weather-icons/" +
                                            weatherCodeConversion(
                                                a.weatherCode
                                            ) +
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
                    </div>
                </div>
            </div>
        </>
    );
}
