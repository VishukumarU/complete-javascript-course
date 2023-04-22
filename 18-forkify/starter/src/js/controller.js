import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';    // polyfill everything else
import 'regenerator-runtime/runtime';   // Polyfill async-await

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async () => {
    try {
        const id = window.location.hash.slice(1);
        if (!id) {
            return;
        }
        recipeView.renderSpinner();
        await model.loadRecipe(id);
        const { recipe } = model.state;
        console.log(recipe);
        recipeView.render(recipe);
    } catch (err) {
        recipeView.renderError();
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
    recipeView.addRenderHandler(controlRecipe);
}

init();

// ['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
