import { suggestionsData } from "@/lib/types";

export default function Suggestions({
    data,
    functionDrill,
}: {
    data: suggestionsData;
    functionDrill: (lat: number, long: number) => void;
}) {
    if (data) {
        if (data.results) {
            return (
                <>
                    <div className="absolute divide-y divide-outline border-[1px] z-10 border-outline rounded-xl lg:rounded-3xl md:rounded-2xl min-w-max dark:bg-dbackground bg-lbackground">
                        {data.results.map((a, index) => {
                            return (
                                <div
                                    className="px-4 py-2 "
                                    key={index}
                                    onClick={() => {
                                        functionDrill(a.latitude, a.longitude);
                                    }}
                                >
                                    <span className="text-black dark:text-white">
                                        {a.name},{" "}
                                    </span>
                                    <span className="text-grayTxt text-sm">
                                        {a.admin1}, {a.country}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
        }
    }
    return <></>;
}
