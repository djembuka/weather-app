export interface GeoCity {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state: string;
    local_names: { [key: string]: string };
};

export type GeoResponse = GeoCity[];

export interface GeoData {
    lat: number;
    lon: number;
    name: string;
    country: string;
};

interface WeatherMain {
    temp: number
};

interface WeatherEntry {
    description: string;
};

export interface WeatherResponse {
    main: WeatherMain;
    weather: WeatherEntry[];
};

export interface WeatherData {
    temp: number,
    description: string;
}

interface WeatherItemMain {
    temp_min: number;
    temp_max: number;
};

interface WeatherItem {
    main: WeatherItemMain;
    weather: WeatherEntry[];
};

interface ForecastCity {
    name: string;
    sunrise: number;
    sunset: number;
}

export interface ForecastResponse {
    list: WeatherItem[];
    city: ForecastCity;
};

interface WeatherItemData {
    temp_min: number;
    temp_max: number;
    description: string;
}

export interface ForecastData {
    list: WeatherItemData[];
    city: ForecastCity;
};