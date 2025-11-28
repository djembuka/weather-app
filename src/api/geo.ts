import type { GeoResponse, GeoData } from '../types'
import { request } from '@/utils/request';
import { Cache } from '@/utils/cache';
import { getUserLangCode } from "@/utils/langCode.ts";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const LIMIT = '1';

const cache = new Cache('geo');

export async function fetchGeo(city: string): Promise<GeoData> {
    const cached = cache.get<GeoData>(city);
    if (cached) return cached;

    const url = `${BASE_URL}?q=${city}&limit=${LIMIT}&appid=${API_KEY}`;
    const data = await request<GeoResponse>(url);

    const userLang = getUserLangCode();
    const cityName = data[0]?.local_names[userLang] || data[0]?.local_names.en || data[0].name;

    const geoData = {
        lat: data[0].lat,
        lon: data[0].lon,
        name: cityName,
        country: data[0].country
    };
    
    cache.set(city, geoData);
    return geoData;
}