import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

/* === state === */
export const state = {
  recipe: {},
};

/* === loadRecipe === */
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
