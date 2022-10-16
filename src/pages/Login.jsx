import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();
  const [infoLogin, setInfoLogin] = useState({
    email: '',
    password: '',
  });

  const redirectToMealsRecipe = () => {
    history.push('/meals');
  };

  const validateButton = () => {
    const SIX = 6;
    const regex = /[\w.ã]+@\w+\.\w{2,8}(\.\w{0,2})?/g;
    const validEmail = regex.test(infoLogin.email);

    if (infoLogin.password.length + 1 >= SIX && validEmail) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const saveInLocalStorage = () => {
    const { email } = infoLogin;
    localStorage.setItem('user', JSON.stringify({ email }));
    localStorage.setItem('mealsToken', 1);
    localStorage.setItem('drinksToken', 1);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setInfoLogin((previousState) => ({
      ...previousState,
      [name]: value,
    }));
    validateButton();
  };

  return (
    <section className="login-bg">
      <div className="recipes-app-logo" />
      <div className="space-div" />
      <form className="login-form">
        <label htmlFor="name">
          <input
            onChange={ handleChange }
            type="email"
            name="email"
            id="name"
            placeholder="username"
            data-testid="email-input"
            className="login-input"
          />
        </label>
        <label htmlFor="password">
          <input
            onChange={ handleChange }
            type="password"
            name="password"
            id="password"
            placeholder="password"
            data-testid="password-input"
            className="login-input"
          />
        </label>
      </form>
      <button
        type="button"
        data-testid="login-submit-btn"
        disabled={ isDisabled }
        className="login-button"
        onClick={ () => {
          saveInLocalStorage();
          redirectToMealsRecipe();
        } }
      >
        login
      </button>
      <div className="create-acc">
        Register account?
      </div>
    </section>
  );
}

export default Login;
