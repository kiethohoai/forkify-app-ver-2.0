import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

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
    // Render spinner on resultsViews
    resultsView.renderSpinner();

    // Get query from the SearchView
    const query = searchView.getQuery();
    if (!query) return;

    // Get data via query in model
    await model.loadSearchResults(query);

    // Render results
    // 1) Render all results (not good)
    // resultsView.render(model.state.search.results);

    // 2) Render with custom results (pagination)
    resultsView.render(model.getSearchResultsPage(1));
  } catch (error) {
    console.log(`🚀error at controlSearchResults (controller.js): `, error);
  }
};

/* === App start === */
const init = (function name(params) {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
})();
