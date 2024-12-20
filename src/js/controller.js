import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

/*=== controlRecipe ===*/
const controlRecipe = async function () {
  try {
    // Get the "hash" id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render the spinner while loading data
    recipeView.renderSpinner();

    // Update the results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

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

    // 3) Render initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(`🚀error at controlSearchResults (controller.js): `, error);
  }
};

/*=== controlPagination ===*/
const controlPagination = function (gotoPage) {
  // Render NEW Results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render NEW Pagination Button
  paginationView.render(model.state.search);
};

/* controlServings */
const controlServings = function (newServings) {
  // 1. Update the recipe servings in state
  model.updateServings(newServings);

  // 2. Update the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

/* controlAddBookmark */
const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

/* controlBookmarks */
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

// TODO: controlAddRecipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(`🚀CHECK  model.state.recipe =>`, model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(`🚀Error at controlAddRecipe (controller.js) =>`, error);
    addRecipeView.renderError(error.message);
  }
};

/* === App start === */
const init = function name(params) {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
