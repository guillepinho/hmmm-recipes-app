import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../context/AppContext';
import SearchBar from './SearchBar';
import '../styles/header.css';

function Header() {
  const [enable, setEnable] = useState(false);
  const history = useHistory();
  const { search, showCat, setShowCat } = useContext(AppContext);

  return (
    <div>
      <section className="top-bar">
        <button
          type="button"
          onClick={ () => history.push('/meals') }
          className="but-logo"
        >
          <div className="recipes-app-logo-top-bar" />
        </button>
        {search && (
          <div className="top-bar-buttons">
            <button
              type="button"
              onClick={ () => setEnable(!enable) }
              className="icon-btn"
            >
              <div className="search-icon" />
            </button>
            <button
              type="button"
              onClick={ () => setShowCat(!showCat) }
              className="icon-btn"
            >
              <div className="menu-icon" />
            </button>
          </div>
        )}
      </section>
      <SearchBar enable={ enable } />
    </div>
  );
}

export default Header;
