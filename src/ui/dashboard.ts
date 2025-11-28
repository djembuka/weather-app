import type { ForecastUi, WeatherUi } from "@/types";

export function weatherUI(data: WeatherUi): void {
    const temp = document.querySelector('#waCurrentTemp') as HTMLParagraphElement | null;
    const description = document.querySelector('#waCurrentDesc') as HTMLParagraphElement | null;

    if (!temp || !description) {
        console.error('На странице нет элемента');
        return;
    }

    temp.textContent = data.temp;
    description.textContent = data.description;
}

export function forecastUI(data: ForecastUi) {
    console.log(data);
}