import { SearchBar } from './components/SearchBar';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = SearchBar();

    if (import.meta.hot) {
        import.meta.hot.dispose(() => {
            searchBar?.cleanup()
        });
    }
});

