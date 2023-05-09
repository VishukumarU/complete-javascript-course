import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config";
import { AJAX } from './helpers';
// import { getJSON, sendJSON } from './helpers';


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

const createRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        cookingTime: recipe.cooking_time,
        ...(recipe.key && { key: recipe.key })  // conditionally add key
    };
};

export const loadRecipe = async (id) => {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);
        state.recipe.bookmarked = state.bookmarks.some(bookMark => bookMark.id === id) ? true : false;

    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async (query) => {
    try {
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        const { recipes } = data.data;
        state.search.query = query;
        state.search.results = recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            ...(recipe.key && { key: recipe.key })
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

const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const toggleBookMark = (recipe) => {

    state.bookmarks.some(bookMark => bookMark?.id === recipe.id) ?
        state.bookmarks.splice(state.bookmarks.findIndex(bookMark => bookMark?.id === recipe.id), 1) :
        state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = !state.recipe?.bookmarked;
    }
    persistBookmarks();
};

const init = () => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (!storedBookmarks) {
        return;
    }
    state.bookmarks = JSON.parse(storedBookmarks);
};

init();

const clearBookmarks = () => {
    localStorage.clear();
};

// clearBookmarks();

export const uploadRecipe = async (newRecipe) => {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(([property, value]) => property.startsWith('ingredient') && !!value)
            .map(([, value]) => {
                const ingredientArr = value.split(',').map(value => value.trim());
                if (ingredientArr.length !== 3) {
                    throw new Error(`Incorrect ingredient format! Please use the correct format`);
                }
                const [quantity, unit, description] = ingredientArr
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        console.log(ingredients);

        const recipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients
        };
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        toggleBookMark(state.recipe);
    } catch (err) {
        throw err;
    }
};
