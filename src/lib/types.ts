export type apiData = {
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

export type locationData = {
    admin1: string;
    admin1_id: number;
    admin3: string;
    admin3_id: number;
    admin4: string;
    admin4_id: number;
    country: string;
    country_code: string;
    country_id: number;
    elevation: number;
    feature_code: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    population: number;
    postcodes: number[];
    timezone: string;
};

export type suggestionsData = {
    results: Array<locationData>;
    generationtime_ms: number;
} | null;
