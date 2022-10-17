import React, { useContext, useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import {
  getDoneRecipesFromLS,
  getFavoriteRecipesFromLS,
  setFavoriteRecipesToLS,
} from '../utils/localStorageManipulation';
import Footer from '../components/Footer';
import shareIcon from '../images/ShareIcon.png';
import whiteHeartIcon from '../images/EmptyHeart.png';
import blackHeartIcon from '../images/FullHeart.png';
import '../styles/favoriteRecipes.css';
import apiRequisitionDetails from '../utils/apiRequisitionDetails';
import '../styles/doneRecipes.css';

function DoneRecipes() {
  const { setInfoHeader } = useContext(AppContext);
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState([]);
  const [favs, setFavs] = useState([]);

  const copyToClipboard = (recipeId, recipetype) => {
    const webURL = window.location.href.split('/');
    webURL.pop();
    copy(`${webURL.join('/')}/${recipetype}s/${recipeId}`);
  };

  const fetchApi = async (type, id) => {
    const result = await apiRequisitionDetails(type, id);
    return result;
  };

  const prepareObject = async (type, id) => {
    const thisRecipe = await fetchApi(type, id);
    const thisRecipeObj = thisRecipe[`${type}s`][0];
    const typeOf = type === 'meals' || type === 'meal' ? 'meal' : 'drink';
    const nationality = thisRecipeObj.strArea || '';
    const category = thisRecipeObj.strCategory || '';
    const alcoholicOrNot = thisRecipeObj.strAlcoholic || '';
    const name = type === 'meals' || type === 'meal'
      ? thisRecipeObj.strMeal : thisRecipeObj.strDrink;
    const image = type === 'meals' || type === 'meal'
      ? thisRecipeObj.strMealThumb
      : thisRecipeObj.strDrinkThumb;

    return {
      id,
      type: typeOf,
      nationality,
      category,
      alcoholicOrNot,
      name,
      image,
    };
  };

  const saveFav = async (type, id) => {
    const favoriteRecipes = getFavoriteRecipesFromLS() || [];

    if (favoriteRecipes.length === 0) {
      const favoriteToAdd = [await prepareObject(type, id)];
      setFavoriteRecipesToLS(favoriteToAdd);
      setFavs(favoriteToAdd);
      return;
    }

    const i = favoriteRecipes.findIndex(({ id: thisId }) => id === thisId);

    if (i >= 0) {
      const oldArray = [...favoriteRecipes];
      const newFavListBeg = oldArray.slice(0, i);
      const newFavListEnd = oldArray.slice(i + 1, oldArray.length);
      const newFavList = [...newFavListBeg, ...newFavListEnd];
      setFavoriteRecipesToLS(newFavList);
      setFavs(newFavList);
      return;
    }
    const favoriteToAdd = await prepareObject(type, id);
    setFavoriteRecipesToLS([...favoriteRecipes, favoriteToAdd]);
    setFavs([...favoriteRecipes, favoriteToAdd]);
  };

  const createCards = (array) => array
    .map(({ id, type,
      category, name, image,
      alcoholicOrNot, doneDate }, index) => {
      const check = favs.some(({ id: thisId }) => id === thisId);
      return (
        <div key={ id } className="recipe-card-done">
          <Link to={ `/${type}s/${id}` }>
            <img
              className="recipe-pic"
              src={ image }
              alt={ name }
              data-testid={ `${index}-horizontal-image` }
            />
          </Link>
          <div
            data-testid={ `${index}-horizontal-name` }
            className="recipe-name-done"
          >
            { name }
          </div>
          { (type === 'drink')
            ? (
              <div
                data-testid={ `${index}-horizontal-top-text` }
                className="recipe-data-info"
              >
                {`${alcoholicOrNot} - ${category}`}
              </div>
            )
            : (
              <div
                data-testid={ `${index}-horizontal-top-text` }
                className="recipe-data-info"
              >
                {`${category}`}
              </div>
            )}
          <div
            data-testid={ `${index}-horizontal-done-date` }
            className="recipe-data-done"
          >
            {doneDate}
          </div>
          <button
            type="button"
            onClick={ () => saveFav(type, id) }
            className="fav-btn-done"
          >
            { check
              ? (
                <img
                  src={ blackHeartIcon }
                  alt="favorite-btn"
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  className="icon-done"
                />)
              : (
                <img
                  src={ whiteHeartIcon }
                  alt="favorite-btn"
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  className="icon-done"
                />)}
          </button>
          <button
            type="button"
            onClick={ () => copyToClipboard(id, type) }
            className="share-btn-done"
          >
            <img
              src={ shareIcon }
              alt="share-icon"
              data-testid={ `${index}-horizontal-share-btn` }
              className="icon-done"
            />
          </button>
        </div>
      );
    });

  useEffect(() => {
    setInfoHeader(() => ({
      title: 'Done Recipes',
      profile: true,
      search: false,
    }));

    setDoneRecipes(getDoneRecipesFromLS() || []);
    setFavs(getFavoriteRecipesFromLS() || []);
  }, []);

  useEffect(() => {
    setShowRecipes(doneRecipes);
  }, [doneRecipes]);

  const filterMeals = () => {
    const filteredMeals = doneRecipes.filter(({ type }) => type === 'meal');
    setShowRecipes(filteredMeals);
  };

  const filterDrinks = () => {
    const filteredDrinks = doneRecipes.filter(({ type }) => type === 'drink');
    setShowRecipes(filteredDrinks);
  };

  const unfilterRecipes = () => {
    setShowRecipes(doneRecipes);
  };

  return (
    <section>
      <Header />
      <div className="recipes-container">
        <div className="categories-buttons-done">
          <button
            type="button"
            data-testid="filter-by-all-btn"
            onClick={ unfilterRecipes }
            className="category-btn-done"
          >
            All
          </button>
          <button
            type="button"
            data-testid="filter-by-meal-btn"
            onClick={ filterMeals }
            className="category-btn-done"
          >
            Meals
          </button>
          <button
            type="button"
            data-testid="filter-by-drink-btn"
            onClick={ filterDrinks }
            className="category-btn-done"
          >
            Drinks
          </button>
        </div>
      </div>
      <div className="recipes-results-done">
        { createCards(showRecipes) }
      </div>
      <Footer />
    </section>
  );
}

export default DoneRecipes;
