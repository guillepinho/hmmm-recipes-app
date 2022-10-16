/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import apiRequisitionDetails from '../utils/apiRequisitionDetails';
import ButtonShareAndFavorite from './ButtonShareAndFavorite';
import { setDoneRecipesToLS,
  getDoneRecipesFromLS,
  setInProgressRecipes } from '../utils/localStorageManipulation';
import '../styles/recipeIP.css';
import home from '../images/Home.png';

function RecipeInProgress() {
  const [checkBoxs, setCheckBoxs] = useState([]);
  const [ingredientsUsed, setIngredientsUsed] = useState([]);
  const history = useHistory();
  const [apiObjectReturn, setApiObjectReturn] = useState({});

  const { location: { pathname } } = history;
  const drinkOrMeal = pathname.split('/')[1];
  const id = pathname.split('/')[2];

  const getRecipesInProgress = () => JSON
    .parse(localStorage.getItem('inProgressRecipes'));

  useEffect(() => {
    if (drinkOrMeal === 'drinks') {
      const fetchApi = async () => {
        const response = await apiRequisitionDetails(drinkOrMeal, id);
        setApiObjectReturn(response.drinks[0]);
      };
      fetchApi();
    } else {
      const fetchApi = async () => {
        const response = await apiRequisitionDetails(drinkOrMeal, id);
        setApiObjectReturn(response.meals[0]);
      };
      fetchApi();
    }
    const doesItHaveLS = getRecipesInProgress();
    if (doesItHaveLS) {
      const recipesInProgress = getRecipesInProgress()[drinkOrMeal][id];
      setIngredientsUsed(recipesInProgress);
    } else {
      const empty = { meals: {}, drinks: {} };
      empty[drinkOrMeal][id] = [];
      setInProgressRecipes(empty);
    }
  }, []);

  const addOrRemoveIngredients = ({ target: { name, checked } }) => {
    if (!checked) {
      const oldArray = [...ingredientsUsed];
      const i = oldArray.findIndex((each) => each === name);
      const newIngredientsListBeg = oldArray.slice(0, i);
      const newIngredientsListEnd = oldArray.slice(i + 1, oldArray.length);
      const newIngredientsList = [...newIngredientsListBeg, ...newIngredientsListEnd];
      setIngredientsUsed(newIngredientsList);
    } else {
      const newArrayOfIngredients = [...ingredientsUsed, name];
      setIngredientsUsed(newArrayOfIngredients);
    }
  };

  const allIngredients = Object
    .entries(apiObjectReturn).filter((ingredient) => ingredient[0]
      .includes('Ingredient') && ingredient[1] !== null)
    .map((each) => each[1]).filter((each) => each !== '');

  const allMeasure = Object
    .entries(apiObjectReturn).filter((measure) => measure[0]
      .includes('Measure') && measure[1] !== null)
    .map((each) => each[1]).filter((each) => each !== ' ');

  const mixOfIngredientsAndMeasure = () => {
    const returnArray = [];
    allIngredients.forEach((_each, index) => {
      const selected = ingredientsUsed.some((each) => each === allIngredients[index]);
      returnArray.push((
        <li key={ index }>
          <label
            htmlFor={ allIngredients[index] }
            data-testid={ `${index}-ingredient-step` }
          >
            <input
              type="checkbox"
              name={ allIngredients[index] }
              id={ allIngredients[index] }
              checked={ selected }
              onChange={ addOrRemoveIngredients }
            />
            {`${allMeasure[index]} ${allIngredients[index]}`}
          </label>
        </li>
      ));
    });
    return returnArray;
  };

  const disabled = () => {
    const sameLength = allIngredients.length === ingredientsUsed.length;
    return !sameLength;
  };

  useEffect(() => {
    const recipesInProgress = getRecipesInProgress();
    if (recipesInProgress) {
      const object = {
        ...recipesInProgress,
        [drinkOrMeal]: {
          ...recipesInProgress[drinkOrMeal],
          [id]: ingredientsUsed,
        },
      };
      setInProgressRecipes(object);
    }
    setCheckBoxs(mixOfIngredientsAndMeasure());
  }, [ingredientsUsed, apiObjectReturn]);

  const finishRecipeMeal = () => {
    const { idMeal,
      strMeal,
      strCategory,
      strNationality,
      strMealThumb } = apiObjectReturn;

    const date = new Date();
    const doneDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const obj = {
      id: idMeal,
      type: 'meal',
      nationality: strNationality || '',
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
      doneDate,
    };
    const oldDoneRecipes = getDoneRecipesFromLS();
    if (oldDoneRecipes === null) {
      setDoneRecipesToLS([obj]);
    } else {
      setDoneRecipesToLS([...oldDoneRecipes, obj]);
    }
    const oldArray = getRecipesInProgress();
    delete oldArray[drinkOrMeal][id];
    setInProgressRecipes(oldArray);
    history.push('/done-recipes');
  };

  const finishRecipeDrink = () => {
    const { idDrink, strAlcoholic, strDrink,
      strCategory, strNationality, strDrinkThumb } = apiObjectReturn;
    const date = new Date();
    const doneDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const obj = {
      id: idDrink,
      type: 'drink',
      nationality: strNationality || '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
      doneDate,
    };
    const oldDoneRecipes = getDoneRecipesFromLS();
    if (oldDoneRecipes === null) {
      setDoneRecipesToLS([obj]);
    } else {
      setDoneRecipesToLS([...oldDoneRecipes, obj]);
    }
    const oldArray = getRecipesInProgress();
    delete oldArray[drinkOrMeal][id];
    setInProgressRecipes(oldArray);
    history.push('/done-recipes');
  };

  return (
    <section className="recipe-details">
      <div className="img-det-section">
        <img
          src={ apiObjectReturn.strMealThumb || apiObjectReturn.strDrinkThumb }
          alt={ apiObjectReturn.strMeal || apiObjectReturn.strDrink }
          data-testid="recipe-photo"
          className="recipe-pic-details"
        />
        <div className="waved-bar" />
      </div>
      <div className="title-and-buttons">
        <div className="title-and-category">
          <div
            data-testid="recipe-title"
            className="recipe-det-name"
          >
            {apiObjectReturn.strDrink
            || apiObjectReturn.strMeal}
          </div>
          <div
            data-testid="recipe-category"
          >
            {apiObjectReturn.strCategory}
          </div>
        </div>
        <div className="det-buttons">
          <button
            type="button"
            onClick={ () => history.push('/meals') }
          >
            <img src={ home } alt="home-icon" className="home-button-icon" />
          </button>
          <ButtonShareAndFavorite />
        </div>
      </div>
      <div
        data-testid="recipe-category"
        className="recipe-det-alcohol"
      >
        {apiObjectReturn.strAlcoholic}
      </div>
      <ul className="ingredients">{checkBoxs}</ul>
      <div
        data-testid="instructions"
        className="det-instructions"
      >
        {apiObjectReturn.strInstructions}

      </div>
      { !disabled() ? (
        <button
          type="button"
          data-testid="finish-recipe-btn"
          className="start-recipe-btn"
          onClick={ drinkOrMeal === 'meals'
            ? finishRecipeMeal : finishRecipeDrink }
        >
          finish recipe
        </button>
      ) : (
        <div />
      ) }

    </section>
  );
}

export default RecipeInProgress;
