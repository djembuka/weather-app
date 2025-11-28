import type { CityEntity, ForecastResponse, ForecastData, WeatherResponse, WeatherData } from "@/types";
import { request } from "@/utils/request";
import { Cache } from "@/utils/cache";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/';

const currentCache = new Cache('weather');

export async function fetchCurrent(city: CityEntity): Promise<WeatherData> {
    const cached = currentCache.get<WeatherData>(city.name);
    if (cached) return cached;

    const url = `${BASE_URL}weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;
    const data = await request<WeatherResponse>(url);

    const weatherData = {
        temp: data.main.temp,
        description: data.weather[0].description,
    };

    currentCache.set(city.name, weatherData);
    return weatherData;
}

const forecastCache = new Cache('forecast');

export async function fetchForecast(city: CityEntity): Promise<ForecastData> {
    const cached = forecastCache.get<ForecastData>(city.name);
    if (cached) return cached;

    const url = `${BASE_URL}forecast?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;
    const data = await request<ForecastResponse>(url);

    const forecastData = {
        list: data.list.map(day => ({
            temp_min: day.main.temp_min,
            temp_max: day.main.temp_max,
            description: day.weather[0].description,
        })),
        city: {
            name: data.city.name,
            sunrise: data.city.sunrise,
            sunset: data.city.sunset
        }
    };

    forecastCache.set<ForecastData>(city.name, forecastData);
    return forecastData;
}