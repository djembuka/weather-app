// fetchGeo.test.ts
import 'dotenv/config';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGeo } from '../../api/geo';
import type { GeoResponse } from '../../types';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const LIMIT = '1';
const CACHE_TTL = 10 * 60 * 1_000;

// Мокаем глобальный fetch и localStorage
vi.mock('global', async (importOriginal) => {
  const actual = await importOriginal<typeof globalThis>();
  return {
    ...actual,
    fetch: vi.fn(),
  };
});

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const mockGeoResponse: GeoResponse = {
  lat: 55.7558,
  lon: 37.6173
};

const expectedUrl = `${BASE_URL}?q=Moscow&limit=${LIMIT}&appid=${API_KEY}`;

describe('fetchGeo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns cached data if it is fresh', async () => {
    // arrange
    localStorage.setItem(
      'geo_moscow',
      JSON.stringify({
        data: mockGeoResponse,
        timestamp: Date.now() - 60_000, // 1 минута назад
      })
    );

    // act
    const result = await fetchGeo('Moscow');

    // assert
    expect(result).toEqual(mockGeoResponse);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('ignores and removes expired cache (older than 10 min)', async () => {
    // arrange
    localStorage.setItem(
      'geo_moscow',
      JSON.stringify({
        data: mockGeoResponse,
        timestamp: Date.now() - CACHE_TTL - 60_000,
      })
    );

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([mockGeoResponse]), { status: 200 })
    );

    // act
    const result = await fetchGeo('Moscow');

    // assert
    expect(result).toEqual(mockGeoResponse);
    expect(localStorage.getItem('geo_moscow')).toContain('"lat":55.7558'); // свежий кэш записан
    expect(localStorage.removeItem).toHaveBeenCalledWith('geo_moscow'); // старый был удалён
  });

  it('fetches from API and caches result when no valid cache', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([mockGeoResponse]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await fetchGeo('Moscow');

    expect(result).toEqual(mockGeoResponse);
    expect(fetch).toHaveBeenCalledWith(expectedUrl);

    const cachedRaw = localStorage.getItem('geo_moscow');
    expect(cachedRaw).toBeDefined();
    const cached = JSON.parse(cachedRaw!);
    expect(cached.data).toEqual(mockGeoResponse);
    expect(typeof cached.timestamp).toBe('number');
  });

  it.each([
    [404, 'Город не найден'],
    [401, 'Неверный API ключ'],
    [500, 'HTTP 500'],
    [503, 'HTTP 503'],
  ])('throws user-friendly error on HTTP %i', async (status, expectedMessage) => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('{}', { status, statusText: 'Error' })
    );

    await expect(fetchGeo('InvalidCity')).rejects.toThrow(expectedMessage);
    expect(fetch).toHaveBeenCalledWith(expectedUrl.replace('Moscow', 'InvalidCity'));
  });

  it('throws original error when response is not ok and status is unexpected', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('{}', { status: 418, statusText: "I'm a teapot" })
    );

    await expect(fetchGeo('Teapot')).rejects.toThrow('HTTP 418');
  });

  it('handles network error / fetch rejection', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(fetchGeo('Moscow')).rejects.toThrow('Failed to fetch');
  });

  it('handles malformed JSON in cache gracefully', async () => {
    localStorage.setItem('geo_moscow', 'this is not json {{{');

    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([mockGeoResponse]), { status: 200 })
    );

    const result = await fetchGeo('Moscow');

    expect(result).toEqual(mockGeoResponse); // всё равно получил свежие данные
    expect(fetch).toHaveBeenCalled();
  });
});