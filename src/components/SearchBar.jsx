/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppContext from '../context/AppContext';
import apiRequisition from '../utils/apiRequisition';

export default function SearchBar({ enable }) {
  const history = useHistory();
  const { setResults } = useContext(AppContext);
  const [drinkOrFood, setDrinkOrFood] = useState('');
  const [searchType, setSearchType] = useState({
    whatToSearch: '',
    searchText: '',
  });

  useEffect(() => {
    const url = window.location.href.split('/');
    const title = url[url.length - 1];
    setDrinkOrFood(title.toLowerCase());
  }, []);

  const handleSearchInputs = ({ target: { name, value } }) => {
    setSearchType({
      ...searchType,
      [name]: value,
    });
  };

  const checkMultipleLetters = () => {
    const { whatToSearch, searchText } = searchType;
    if (whatToSearch === 'f' && searchText.length > 1) {
      global.alert('Your search must have only 1 (one) character');
      return true;
    }
    return false;
  };

  const sendSearchRequest = async () => {
    const msg = 'Sorry, we haven\'t found any recipes for these filters.';
    const { whatToSearch, searchText } = searchType;
    if (checkMultipleLetters()) {
      return;
    }
    const result = await apiRequisition(whatToSearch, searchText, drinkOrFood);
    if (!result || result.drinks === null || result.meals === null) {
      global.alert(msg);
      return;
    }
    if (drinkOrFood === 'meals') {
      setResults(result.meals);
    } else {
      setResults(result.drinks);
    }
    if (result[drinkOrFood].length === 1) {
      const id = Object.values(result[drinkOrFood][0])[0];
      history.push(`/${drinkOrFood}/${id}`);
    }
  };

  return (
    <div className={ enable ? 'search-bar show' : 'search-bar' }>
      <div className="search-text-and-button">
        <input
          data-testid="search-input"
          name="searchText"
          value={ searchType.searchText }
          type="text"
          placeholder="what are you hungry for?"
          onChange={ handleSearchInputs }
          className="search-input"
        />
        <button
          type="button"
          data-testid="exec-search-btn"
          className="search-btn"
          onClick={ sendSearchRequest }
        >
          go!
        </button>
      </div>
      <div className="filter-buttons">
        <span className="title-filter">search for:</span>
        <input
          type="radio"
          className="radio-input"
          name="whatToSearch"
          value="i"
          id="ingredient"
          data-testid="ingredient-search-radio"
          onClick={ handleSearchInputs }
        />
        <label htmlFor="ingredient">
          ingredients
        </label>
        <input
          type="radio"
          className="radio-input"
          name="whatToSearch"
          value="s"
          id="name"
          data-testid="name-search-radio"
          onClick={ handleSearchInputs }
        />
        <label htmlFor="name">
          recipe name
        </label>
        <input
          type="radio"
          className="radio-input"
          name="whatToSearch"
          value="f"
          id="first-letter"
          data-testid="first-letter-search-radio"
          onClick={ handleSearchInputs }
        />
        <label htmlFor="first-letter">
          first letter
        </label>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  enable: PropTypes.bool.isRequired,
};
