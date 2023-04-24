import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from './helpers';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    }
};

export const loadRecipe = async (id) => {
    try {
        const data = await getJSON(`${API_URL}${id}`);
        const { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            cookingTime: recipe.cooking_time
        };
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async (query) => {
    try {
        const data = await getJSON(`${API_URL}?search=${query}`)
        console.log(data);
        const { recipes } = data.data;
        state.search.query = query;
        state.search.results = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
        }));
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = (page) * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
};
