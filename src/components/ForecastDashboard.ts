import { fetchCurrent, fetchForecast } from "@/api/weather";
import { handleError } from "@/utils/errorHandler";
import { weatherUI, forecastUI } from "@/ui/dashboard.ts";
import type { CityEntity, ForecastData, ForecastUi, WeatherData, WeatherUi } from "@/types";

const convertToday = (data: WeatherData): WeatherUi => {
    const temp = Math.round(data.temp - 273.15);
    const description = data.description;

    return {
        temp: String(temp),
        description: String(description),
    };
}

const convertForecast = (data: ForecastData): ForecastUi => {
    return {
        list: data.list.map(day => ({
            temp_min: String(Math.round(day.temp_min - 273.15)),
            temp_max: String(Math.round(day.temp_max - 273.15)),
            description: String(day.description)
        })),
        city: {
            name: String(data.city.name),
            sunrise: String(data.city.sunrise),
            sunset: String(data.city.sunset)
        }
    };
}

export async function TodayForecast(city: CityEntity) {
    try {
        const data = await fetchCurrent(city);
        const converted = convertToday(data);
        weatherUI(converted);
    } catch(error) {
        handleError(error, 'Погода сегодня');
    }
}

export async function FiveDaysForecast(city: CityEntity) {
    try {
        const data = await fetchForecast(city);
        const converted = convertForecast(data);
        forecastUI(converted);
    } catch(error) {
        handleError(error, 'Прогноз')
    }
}