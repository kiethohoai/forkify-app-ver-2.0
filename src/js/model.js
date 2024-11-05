import { API_URL } from './config.js';

/* === state === */
export const state = {
  recipe: {},
};

/* === loadRecipe === */
export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();

    if (!res.ok)
      throw Error(`${data.message} ${res.statusText}  ${res.status}`);

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

    console.log(`state.recipe: `, state.recipe);
  } catch (error) {
    console.error(`🚀Error on loadRecipe (model.js) =>`, error);
    throw error;
  }
};
