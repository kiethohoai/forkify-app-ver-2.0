import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

/*=== state ===*/
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// TODO: createRecipeObject
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/*=== loadRecipe ===*/
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);

    /* Convert Data
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
    */

    if (state.bookmarks.some((bookmark) => bookmark.id === state.recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(`🚀state.recipe =>`, state.recipe);
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

/* updateServings */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

/* persistBookmarks */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/* addBookmark */
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

/* deleteBookmark */
export const deleteBookmark = function (id) {
  // Find the bookmark with the same "id" and delete it
  const index = state.bookmarks.findIndex((el) => el.id === id);
  if (index !== -1) state.bookmarks.splice(index, 1);

  // Unbookmark current recipe
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/* init */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // Data maybe undefine sometime!
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/* clearBookmarks */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// TODO: uploadRecipe
export const uploadRecipe = async function (newRecipe) {
  try {
    // INPUT
    // console.log(`🚀OBJECT newRecipe =>`, newRecipe);
    // console.log(`🚀ARRAY newRecipe =>`, Object.entries(newRecipe));

    // TODO
    const ingredients = Object.entries(newRecipe)
      .filter((ing) => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use the correct format.`,
          );

        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    // OUTPUT
    // console.log(`🚀  ingredients =>`, ingredients);
    // console.log(`🚀  recipe =>`, recipe);
    console.log(`🚀FINAL data =>`, data);
  } catch (error) {
    throw error;
  }
};
