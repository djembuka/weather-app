import { handleError } from "@/utils/errorHandler";
import { fetchGeo } from "@/api/geo";
import { TodayForecast, FiveDaysForecast } from "@/components/ForecastDashboard";
import type { CityEntity, GeoData } from "@/types";

export function SearchBar() {
    
    const input = document.querySelector('#waInput') as HTMLInputElement | null;
    const inputButton = document.querySelector('#waInputButton') as HTMLButtonElement | null;
    const cityDisplay = document.querySelector('#waCityName') as HTMLDivElement | null;

    if (!input || !inputButton || !cityDisplay) {
        console.error('Some element doesnt exist in DOM');
        return;
    }

    const handleSearch = async () => {
        const query = input.value.trim();

        if (!query) {
            cityDisplay.textContent = 'Введите название города';
            return;
        }

        inputButton.disabled = true;
        inputButton.textContent = 'Search...';
        cityDisplay.textContent = '';

        try {
            const city : CityEntity = await fetchGeo(query);
            cityDisplay.textContent = `${city.name} ${city.country}`;

            TodayForecast(city);
            FiveDaysForecast(city);

        } catch (error) {
            handleError(error, 'Геокодер');
        } finally {
            inputButton.disabled = false;
            inputButton.textContent = 'OK';
        }
    }

    const cleanup = () => {
        inputButton.removeEventListener('click', handleSearch);
    };

    inputButton.addEventListener('click', handleSearch);
    
    return {cleanup};
};

