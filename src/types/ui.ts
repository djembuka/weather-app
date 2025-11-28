export interface CityEntity {
    lat: number;
    lon: number;
    name: string;
    country: string;
}

export interface WeatherUi {
    temp: string;
    description: string;
}

interface ForecastCityUi {
    name: string;
    sunrise: string;
    sunset: string;
}

interface WeatherItemUi {
    temp_min: string;
    temp_max: string;
    description: string;
}

export interface ForecastUi {
    list: WeatherItemUi[];
    city: ForecastCityUi;
};