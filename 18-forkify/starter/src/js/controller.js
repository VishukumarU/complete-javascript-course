import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';    // polyfill everything else
import 'regenerator-runtime/runtime';   // Polyfill async-await
import { MODAL_CLOSE_SECONDS } from './config.js';

// https://forkify-api.herokuapp.com/v2

if (module.hot) {
    // module.hot.accept();
}

const controlRecipe = async () => {
    try {
        const id = window.location.hash.slice(1);
        if (!id) {
            return;
        }
        recipeView.renderSpinner();
        await model.loadRecipe(id);
        const { recipe } = model.state;
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);
        recipeView.render(recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async () => {
    try {
        resultsView.renderSpinner();
        const query = searchView.getQuery();
        if (!query) {
            return;
        }
        await model.loadSearchResults(query);
        resultsView.render(model.getSearchResultsPage());
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};

const controlPagination = (goToPage) => {
    resultsView.render(model.getSearchResultsPage(goToPage));
    paginationView.render(model.state.search);
};

const controlNewServings = (newServings) => {
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
};

const controlToggleBookMark = () => {
    model.toggleBookMark(model.state.recipe);
    console.log(model.state.recipe);
    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
    bookmarksView.render(model.state.bookmarks)
};

const controlAddRecipe = async (newRecipe) => {

    try {
        addRecipeView.renderSpinner();
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);
        recipeView.render(model.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(model.state.bookmarks);
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        setTimeout(() => {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SECONDS);
    } catch (err) {
        console.error(`🔴 ${err.message}`);
        addRecipeView.renderError(err.message);
    }
};

/*
    The click, load etc events are Presentation logic. So, we shouldn't add any eventhandlers directly
    in this file. But, the view of MVC doesn't know that there is a controller as we are not supposed to
    import controller into the view.

    The solution is the Publisher-Subscriber pattern
    In view, we add a method that publishes the events, and in the controller, we add a subscriber which 
    says what the publisher has to do -- by passing the callback function
*/

const init = () => {
    // Subsciber to the events
    bookmarksView.addRenderHandler(controlBookmarks);
    recipeView.addRenderHandler(controlRecipe);
    recipeView.addUpdateServingsHandler(controlNewServings);
    recipeView.addToggleBookMarkHandler(controlToggleBookMark);
    searchView.addSearchHandler(controlSearchResults);
    paginationView.addBtnClickHandler(controlPagination);
    addRecipeView.addUploadHandler(controlAddRecipe);
}

init();

// ['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
