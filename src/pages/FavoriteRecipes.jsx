import React, { useState, useContext, useEffect } from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import {
  getFavoriteRecipesFromLS,
  setFavoriteRecipesToLS,
} from '../utils/localStorageManipulation';
import Footer from '../components/Footer';
import shareIcon from '../images/ShareIcon.png';
import blackHeartIcon from '../images/FullHeart.png';
import '../styles/favoriteRecipes.css';

function FavoriteRecipes() {
  const { setInfoHeader } = useContext(AppContext);
  const [favRecipes, setfavRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(favRecipes);

  const copyToClipboard = (recipeId, recipetype) => {
    const webURL = window.location.href.split('/');
    webURL.pop();
    copy(`${webURL.join('/')}/${recipetype}s/${recipeId}`);
  };

  const removeFromFavorites = (recipeId) => {
    const favoriteRecipes = getFavoriteRecipesFromLS();
    const oldArray = [...favoriteRecipes];
    const index = oldArray.findIndex(({ id }) => id === recipeId);
    const newFavListBeg = oldArray.slice(0, index);
    const newFavListEnd = oldArray.slice(index + 1, oldArray.length);
    const newFavList = [...newFavListBeg, ...newFavListEnd];
    setFavoriteRecipesToLS(newFavList);
    const listToUpdateComponent = getFavoriteRecipesFromLS();
    setfavRecipes(listToUpdateComponent);
  };

  const createCards = (array) => array
    .map(({ id, type, category, name, image, alcoholicOrNot }, index) => (
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

        <button
          type="button"
          onClick={ () => removeFromFavorites(id) }
          className="fav-btn-done"
        >
          <img
            src={ blackHeartIcon }
            alt="favorite-btn"
            data-testid={ `${index}-horizontal-favorite-btn` }
            className="icon-done"
          />
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
    ));

  useEffect(() => {
    setInfoHeader(() => ({
      title: 'Favorite Recipes',
      profile: true,
      search: false,
    }));

    setfavRecipes(getFavoriteRecipesFromLS() || []);
  }, []);

  useEffect(() => {
    setShowRecipes(favRecipes);
  }, [favRecipes]);

  const filterMeals = () => {
    const filteredMeals = favRecipes.filter(({ type }) => type === 'meal');
    setShowRecipes(filteredMeals);
  };

  const filterDrinks = () => {
    const filteredDrinks = favRecipes.filter(({ type }) => type === 'drink');
    setShowRecipes(filteredDrinks);
  };

  const unfilterRecipes = () => {
    setShowRecipes(favRecipes);
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
        <div className="recipes-results">
          { createCards(showRecipes) }
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default FavoriteRecipes;
