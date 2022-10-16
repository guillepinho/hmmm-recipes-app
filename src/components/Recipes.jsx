import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import '../styles/recipes.css';

const MAX_CARDS = 11;
const MAX_CATEGORIES = 10;
function Recipes() {
  const { results, categories, title,
    setResults, showCat, setShowCat } = useContext(AppContext);
  const [recipeCards, setRecipeCards] = useState([]);
  const [categoriesButtons, setCategoriesButton] = useState();
  const [isFiltered, setIsFiltered] = useState('no');

  const clearFilter = async () => {
    let URLToFetch = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    if (title === 'Drinks') {
      URLToFetch = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    }
    const request = await fetch(URLToFetch);
    const data = await request.json();
    if (title === 'Drinks') {
      setResults(data.drinks);
      return;
    }
    setResults(data.meals);
  };

  const filterByCategory = async (filter) => {
    if (isFiltered === filter) {
      setIsFiltered('no');
      await clearFilter();
      return;
    }
    setIsFiltered(filter);
    let URLToFetch = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${filter}`;
    if (title === 'drinks') {
      URLToFetch = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${filter}`;
    }
    const request = await fetch(URLToFetch);
    const data = await request.json();
    if (title === 'drinks') {
      setResults(data.drinks);
      return;
    }
    setResults(data.meals);
  };

  const nameControl = (name) => {
    const MAX = 22;
    const POS = 21;
    let result = name;
    if (name.length >= MAX) {
      result = `${result.slice(0, POS)}...`;
    }
    return result;
  };

  useEffect(() => {
    if (!results || !categories) return;
    const cards = results.map((recipe, index) => {
      if (index > MAX_CARDS) return false;
      const name = recipe.strMeal || recipe.strDrink;
      const link = title === 'meals'
        ? `/meals/${recipe.idMeal}` : `/drinks/${recipe.idDrink}`;
      return (
        <div
          data-testid={ `${index}-recipe-card` }
          className="recipe-card"
          key={ index }
        >
          <Link to={ link }>
            <div
              data-testid={ `${index}-card-name` }
              className="recipe-name"
            >
              {nameControl(name)}
            </div>
            <img
              data-testid={ `${index}-card-img` }
              src={ recipe.strMealThumb || recipe.strDrinkThumb }
              alt="recipe card"
              className="recipe-pic"
            />
          </Link>
        </div>
      );
    });
    setRecipeCards(cards);

    const buttons = categories.map((categorie, index) => {
      if (index > MAX_CATEGORIES) {
        return false;
      }
      if (index === MAX_CATEGORIES) {
        return (
          <button
            type="button"
            key={ index }
            data-testid="All-category-filter"
            onClick={ clearFilter }
            className="category-btn"
          >
            All
          </button>
        );
      }
      return (
        <button
          type="button"
          key={ index }
          data-testid={ `${categorie.strCategory}-category-filter` }
          onClick={ () => {
            filterByCategory(categorie.strCategory);
            setShowCat(false);
          } }
          className="category-btn"
        >
          {categorie.strCategory}
        </button>
      );
    });
    setCategoriesButton(buttons);
  }, [results, categories]);

  return (
    <div className="recipes-container">
      <div className={ showCat ? 'categories-buttons show-cat' : 'categories-buttons' }>
        {categoriesButtons}
      </div>
      <div className="recipes-results">{recipeCards}</div>
    </div>
  );
}
export default Recipes;
