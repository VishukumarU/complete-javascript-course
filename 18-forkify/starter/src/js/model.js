import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from './helpers';


export const state = {
    recipe: {
        bookmarked: false
    },
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: []
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

        state.recipe.bookmarked = state.bookmarks.some(bookMark => bookMark.id === id) ? true : false;

    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async (query) => {
    try {
        const data = await getJSON(`${API_URL}?search=${query}`);
        const { recipes } = data.data;
        state.search.query = query;
        state.search.results = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
        }));
        state.search.page = 1;
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

export const updateServings = newServings => {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
};

export const toggleBookMark = (recipe) => {

    state.bookmarks.some(bookMark => bookMark?.id === recipe.id) ?
        state.bookmarks.splice(state.bookmarks.findIndex(bookMark => bookMark?.id === recipe.id), 1) :
        state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = !state.recipe?.bookmarked;
    }
};
