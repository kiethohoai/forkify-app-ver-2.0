import { API_URL } from './config.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/* ===== showRecipe =====  */
const showRecipe = async function () {
  try {
    // const res = await fetch(`${API_URL}/664c8f193e7aa067e94e8706`);
    const res = await fetch(`${API_URL}/664c8f193e7aa067e94e8438`);
    const data = await res.json();

    if (!res.ok)
      throw Error(`${data.message} ${res.statusText}  ${res.status} `);

    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(`🚀  recipe =>`, recipe);
  } catch (error) {
    console.error(`🚀Error at showRecipe (controll.js) =>`, error);
  }
};
showRecipe();
