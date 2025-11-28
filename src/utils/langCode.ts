export function getUserLangCode(): string {
    return Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]?.toLowerCase();
}