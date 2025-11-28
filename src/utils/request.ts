export async function request<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        if (response.status === 404) {
            error.message = 'Город не найден';
        } else if (response.status === 401) {
            error.message = 'Неверный API ключ';
        }
        throw error;
    }

    const result = await response.json();
    const data = result;

    return data as Promise<T>;
}