import * as model from './model.js';
import recipeView from './views/recipeView.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/* === controlRecipe === */
const controlRecipe = async function () {
  try {
    // Get the "hash" id
    const id = window.location.hash.slice(1);
    console.log(`🚀  id =>`, id);
    if (!id) return;

    // Render the spinner while loading data
    recipeView.renderSpinner();

    // Loading recipe (data)
    await model.loadRecipe(id);

    // Render recipe (data)
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(`🚀Error at controlRecipe (controll.js) =>`, error);
  }
};

/* Old way
window.addEventListener('hashchange', showRecipe);
window.addEventListener('load', showRecipe); */

// New way to load multil events
['hashchange', 'load'].forEach((ev) => window.addEventListener(ev, controlRecipe));
