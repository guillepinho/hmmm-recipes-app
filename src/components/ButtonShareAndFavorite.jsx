import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import shareIcon from '../images/ShareIcon.png';
import whiteHeartIcon from '../images/EmptyHeart.png';
import blackHeartIcon from '../images/FullHeart.png';
import {
  getFavoriteRecipesFromLS,
  setFavoriteRecipesToLS } from '../utils/localStorageManipulation';
import apiRequisitionDetails from '../utils/apiRequisitionDetails';
import '../styles/shareAndFavButtons.css';

function ButtonShareAndFavorite() {
  const history = useHistory();
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [thisRecipeObj, setThisRecipeObj] = useState({});

  const { location: { pathname } } = history;
  const drinkOrMeal = pathname.split('/')[1];
  const idFromUrl = pathname.split('/')[2];

  useEffect(() => {
    const favoriteRecipes = getFavoriteRecipesFromLS() || [];

    if (favoriteRecipes.length > 0) {
      const check = favoriteRecipes.some(({ id }) => id === idFromUrl);
      if (check) {
        setIsFav(true);
      }
    }

    const fetchApi = async () => {
      const result = await apiRequisitionDetails(drinkOrMeal, idFromUrl);
      setThisRecipeObj(result[drinkOrMeal][0]);
    };
    fetchApi();
  }, []);

  const prepareObject = () => {
    const id = drinkOrMeal === 'meals' ? thisRecipeObj.idMeal : thisRecipeObj.idDrink;
    const type = drinkOrMeal === 'meals' ? 'meal' : 'drink';
    const nationality = thisRecipeObj.strArea || '';
    const category = thisRecipeObj.strCategory || '';
    const alcoholicOrNot = thisRecipeObj.strAlcoholic || '';
    const name = drinkOrMeal === 'meals' ? thisRecipeObj.strMeal : thisRecipeObj.strDrink;
    const image = drinkOrMeal === 'meals'
      ? thisRecipeObj.strMealThumb
      : thisRecipeObj.strDrinkThumb;

    return {
      id,
      type,
      nationality,
      category,
      alcoholicOrNot,
      name,
      image,
    };
  };

  const copyToClipboard = () => {
    const MAX_LENGTH = 5;
    const webURL = window.location.href.split('/');
    if (webURL.length > MAX_LENGTH) {
      webURL.pop();
    }
    copy(`${webURL.join('/')}`);
    setCopied(true);
  };

  const saveFav = () => {
    setIsFav(!isFav);
    const favoriteRecipes = getFavoriteRecipesFromLS() || [];

    if (!isFav) {
      if (favoriteRecipes.length > 0) {
        setFavoriteRecipesToLS([...favoriteRecipes, prepareObject()]);
        return;
      }
      setFavoriteRecipesToLS([prepareObject()]);
      return;
    }
    const oldArray = [...favoriteRecipes];
    const index = oldArray.findIndex(({ id }) => id === idFromUrl);
    const newFavListBeg = oldArray.slice(0, index);
    const newFavListEnd = oldArray.slice(index + 1, oldArray.length);
    const newFavList = [...newFavListBeg, ...newFavListEnd];
    setFavoriteRecipesToLS(newFavList);
  };

  return (
    <section className="share-and-fav-buttons">
      <button
        type="button"
        data-testid="share-btn"
        onClick={ copyToClipboard }
      >
        <img src={ shareIcon } alt="share-icon" className="icon-btn" />
      </button>
      <button
        type="button"
        onClick={ saveFav }
      >
        { !isFav
          ? (
            <img
              src={ whiteHeartIcon }
              alt="share-icon"
              data-testid="favorite-btn"
              className="icon-btn"
            />)
          : (
            <img
              src={ blackHeartIcon }
              alt="share-icon"
              data-testid="favorite-btn"
              className="icon-btn"
            />)}
      </button>
      { copied ? <span className="link-copied">Link copied!</span> : '' }
    </section>
  );
}

export default ButtonShareAndFavorite;
