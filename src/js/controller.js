import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

/*=== controlRecipe ===*/
const controlRecipe = async function () {
  try {
    // Get the "hash" id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render the spinner while loading data
    recipeView.renderSpinner();

    // Loading recipe (data)
    await model.loadRecipe(id);

    // Render recipe (data)
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(`🚀Error at controlRecipe (controll.js) =>`, error);
    recipeView.renderError();
  }
};

/*=== controlSearchResults ===*/
const controlSearchResults = async function () {
  try {
    // Get query from the Views
    const query = searchView.getQuery();
    if (!query) return;
    console.log(`🚀  query =>`, query);

    // Get data via query in model
    await model.loadSearchResults(query);

    // Render results
    console.log(`SEARCH RESULT`, model.state.search);
  } catch (error) {
    console.log(`🚀error at controlSearchResults (controller.js): `, error);
  }
};
controlSearchResults();

/* === App start === */
const init = (function name(params) {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
})();
