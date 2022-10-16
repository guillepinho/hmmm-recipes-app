import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../context/AppContext';

function StartRecipeButton() {
  const { idDetails, buttonName } = useContext(AppContext);
  const history = useHistory(); // desmonta o componente.

  const saveInLocalStorage = () => {
    let objInProgressRecipe = {};
    if (idDetails.idMeal) {
      const objMeals = {
        meals: {
          [idDetails.idMeal]: [],
        },
      };
      objInProgressRecipe = { ...objMeals };
    }
    if (idDetails.idDrink) {
      const objDrinks = {
        drinks: {
          [idDetails.idDrink]: [],
        },
      };
      objInProgressRecipe = { ...objDrinks };
    }
    const teste = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (teste === null) {
      if (objInProgressRecipe.meals) {
        objInProgressRecipe.drinks = {};
      } else {
        objInProgressRecipe.meals = {};
      }
      localStorage.setItem(
        'inProgressRecipes',
        JSON.stringify(objInProgressRecipe),
      );
    } else {
      teste.meals = { ...teste.meals, ...objInProgressRecipe.meals };
      teste.drinks = { ...teste.drinks, ...objInProgressRecipe.drinks };
      localStorage.setItem('inProgressRecipes', JSON.stringify(teste));
    }
  };

  return (
    <button
      type="button"
      data-testid="start-recipe-btn"
      className="start-recipe-btn"
      onClick={ () => {
        saveInLocalStorage();
        if (idDetails.idMeal) {
          const link = `/meals/${idDetails.idMeal}/in-progress`;
          history.push(link);
        } else {
          const link = `/drinks/${idDetails.idDrink}/in-progress`;
          history.push(link);
        }
      } }
    >
      {buttonName}
    </button>
  );
}

export default StartRecipeButton;
