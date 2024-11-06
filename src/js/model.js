import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

/*=== state ===*/
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

/*=== loadRecipe ===*/
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    // console.error(`🚀Error on loadRecipe (model.js) =>`, error);
    throw error;
  }
};

/*=== loadSearchResults ===*/
export const loadSearchResults = async function (query = 'pizza') {
  try {
    // Fetching & getting data from API
    const data = await getJSON(`${API_URL}?search=${query}`);

    // Store data in "state" of Model
    state.search.query = query;
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    console.log(`🚀Error at loadSearchResults (model.js): `, error);
    throw error;
  }
};

/*==== getSearchResultsPage (Paginatio) ====*/
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.results.slice(start, end);
};
