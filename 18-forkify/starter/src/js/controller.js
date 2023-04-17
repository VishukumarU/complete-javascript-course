const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${ s } second`));
        }, s * 1000);
    });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

console.log('TESTING');

/* 
    288: Loading a recipe from API
*/

const showRecipe = async () => {
    try {
        // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
        const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcb37');
        const data = await res.json();
        console.log(res, data);

        if (!res.ok) {
            throw new Error(`${ data.message } (${ res.status } -- ${ res.statusText })`);
        }

        let { recipe } = data.data;
        recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            cookingTime: recipe.cooking_time
        }

        console.log(recipe);
    } catch (err) {
        alert(err);
    }
};

showRecipe();
