import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import apiRequisitionDetails from '../utils/apiRequisitionDetails';
import apiRequisitionRecommendation from '../utils/apiRequisitionRecommendations';
import StartRecipeButton from './StartRecipeButton';
import { getDoneRecipesFromLS } from '../utils/localStorageManipulation';
import AppContext from '../context/AppContext';
import ButtonShareAndFavorite from './ButtonShareAndFavorite';
import '../styles/recipeDetails.css';
import home from '../images/Home.png';

const MAXRECOMMENDATIONS = 2;
const STARTRECIPE = 'start recipe';

function RecipeDetails() {
  const history = useHistory();
  const [apiObjectReturn, setApiObjectReturn] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const { setIdDetails, setButtonName } = useContext(AppContext);
  const { location: { pathname } } = history;
  const drinkOrMeal = pathname.split('/')[1];
  const id = pathname.split('/')[2];

  const checkRecipeMealsInLocalStorage = (response) => {
    const recipeSaved = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (!recipeSaved) return null;
    if (recipeSaved.meals[response.meals[0].idMeal]) {
      setButtonName('continue recipe');
    }
  };

  const checkRecipeDrinksInLocalStorage = (response) => {
    const recipeSaved = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (!recipeSaved) return null;
    if (recipeSaved.drinks[response.drinks[0].idDrink]) {
      setButtonName('continue recipe');
    }
    if (!recipeSaved.drinks[response.drinks[0].idDrink]) {
      setButtonName(STARTRECIPE);
    }
  };

  useEffect(() => {
    const doneRecipes = getDoneRecipesFromLS();
    setButtonName(STARTRECIPE);
    if (doneRecipes !== null) {
      const isItDone = doneRecipes
        .some(({ id: thisId, type }) => (drinkOrMeal.includes(type) && id === thisId));
      if (isItDone) {
        setIsDone(true);
      }
    }
    if (drinkOrMeal === 'drinks') {
      const fetchApi = async () => {
        const response = await apiRequisitionDetails(drinkOrMeal, id);
        setApiObjectReturn(response.drinks[0]);
        setIdDetails(response.drinks[0]);
        const recom = await apiRequisitionRecommendation('meals');
        setRecommendations(recom.meals);
        checkRecipeDrinksInLocalStorage(response);
      };
      fetchApi();
    } else {
      const fetchApi = async () => {
        const response = await apiRequisitionDetails(drinkOrMeal, id);
        setApiObjectReturn(response.meals[0]);
        setIdDetails(response.meals[0]);
        const recom = await apiRequisitionRecommendation('drinks');
        setRecommendations(recom.drinks);
        checkRecipeMealsInLocalStorage(response);
      };
      fetchApi();
    }
  }, []);

  let embedURL = apiObjectReturn.strYoutube;
  if (apiObjectReturn.strYoutube !== undefined) {
    embedURL = `https://youtube.com/embed/${apiObjectReturn.strYoutube.split('=')[1]}`;
  }

  const allIngredients = Object
    .entries(apiObjectReturn)
    .filter((ingredient) => ingredient[0]
      .includes('Ingredient') && ingredient[1] !== null)
    .map((each) => each[1])
    .filter((each) => each !== '');

  const allMeasure = Object
    .entries(apiObjectReturn).filter((measure) => measure[0]
      .includes('Measure') && measure[1] !== null)
    .map((each) => each[1])
    .filter((each) => each !== ' ');

  const mixOfIngredientsAndMeasure = () => {
    const returnArray = [];
    allIngredients.forEach((_each, index) => {
      returnArray.push((
        <li
          data-testid={ `${index}-ingredient-name-and-measure` }
          key={ index }
        >
          {`${allMeasure[index]} ${allIngredients[index]}`}
        </li>
      ));
    });
    return returnArray;
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
            {apiObjectReturn.strMeal || apiObjectReturn.strDrink}
          </div>
          <div
            data-testid="recipe-category"
            className="recipe-det-category"
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
      <ul>
        {mixOfIngredientsAndMeasure()}
      </ul>
      <div
        data-testid="instructions"
        className="det-instructions"
      >
        {apiObjectReturn.strInstructions}
      </div>
      {apiObjectReturn.strYoutube
      && <iframe
        title="video"
        width="360"
        data-testid="video"
        className="det-video"
        src={ embedURL }
      />}
      <div className="det-recommends">
        <div className="det-recommend-title">Something to go with?</div>
        <div className="det-recommends-prod">
          { recommendations.map((recommendation, index) => {
            if (index >= MAXRECOMMENDATIONS) return false;
            if (recommendation.strDrink) {
              return (
                <Link to={ `/drinks/${recommendation.idDrink}` } key={ index }>
                  <img
                    src={ recommendation.strDrinkThumb }
                    alt={ recommendation.strDrink }
                    data-testid="recipe-photo"
                    className="recipe-pic-recommend"
                  />
                </Link>
              );
            }
            return (
              <Link to={ `/meals/${recommendation.idMeal}` } key={ index }>
                <img
                  src={ recommendation.strMealThumb }
                  alt={ recommendation.strMeal }
                  data-testid="recipe-photo"
                  className="recipe-pic-recommend"
                />
              </Link>
            );
          }) }
        </div>
      </div>
      { isDone ? '' : <StartRecipeButton />}
    </section>
  );
}

export default RecipeDetails;
