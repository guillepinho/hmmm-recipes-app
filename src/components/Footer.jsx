import React from 'react';
import { Link } from 'react-router-dom';
import drinkIcon from '../images/Drinks.png';
import mealIcon from '../images/Meals.png';

function Footer() {
  return (
    <section className="footer-bar">
      <Link
        to="/drinks"
        data-testid="drinks-bottom-btn"
        src={ drinkIcon }
      >
        <div className="drink-icon" />
      </Link>
      <Link
        to="/meals"
        data-testid="meals-bottom-btn"
        src={ mealIcon }
      >
        <div className="meal-icon" />
      </Link>
      <Link
        to="/profile"
      >
        <div className="profile-icon" />
      </Link>
    </section>
  );
}

export default Footer;
