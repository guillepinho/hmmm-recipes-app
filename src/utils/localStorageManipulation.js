export const getDoneRecipesFromLS = () => JSON.parse(localStorage.getItem('doneRecipes'));

export const setDoneRecipesToLS = (array) => localStorage.setItem('doneRecipes', JSON
  .stringify(array));

export const getFavoriteRecipesFromLS = () => JSON
  .parse(localStorage.getItem('favoriteRecipes'));

export const setFavoriteRecipesToLS = (data) => localStorage
  .setItem('favoriteRecipes', JSON.stringify(data));

export const getInProgressRecipes = () => {
  JSON.parse(localStorage.getItem('inProgressRecipes'));
};

export const setInProgressRecipes = (data) => {
  localStorage.setItem('inProgressRecipes', JSON.stringify(data));
};
