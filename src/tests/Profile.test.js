import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import logIn from './helpers/logIn';
import { apiMockInitialMealsRecipes, apiMockCategoryMeals, apiMockDesserts, apiApamBalik, apiMockInitialDrinksRecipes, apiMockCategoryDrinks, apiCocoa } from './helpers/apiMocks';

const MEALS_CATEGORY_LIST_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const DESSERT_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
const INITIAL_DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
// const APAM_BALIK = 'Apam balik';

fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=', apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);
fetchMock.mock(DESSERT_URL, apiMockDesserts);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/lookup.php?i=53049', apiApamBalik);
fetchMock.mock(INITIAL_DRINKS_URL, apiMockInitialDrinksRecipes);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list', apiMockCategoryDrinks);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocoa', apiCocoa);

describe('Testing Profile component', () => {
  it('testa se a página é renderizada com 4 botões', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const imgProfile = screen.queryByTestId(/profile-top-btn/i);
    expect(imgProfile).toBeInTheDocument();

    userEvent.click(imgProfile);

    expect(history.location.pathname).toEqual('/profile');

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(4);
  });
  it('testa se ao clicar no botão "Done Recipes" a página é redirecionada para receitas prontas', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const imgProfile = screen.queryByTestId(/profile-top-btn/i);
    expect(imgProfile).toBeInTheDocument();

    userEvent.click(imgProfile);

    expect(history.location.pathname).toEqual('/profile');

    const doneRecipesButton = screen.queryByRole('button', { name: /done recipes/i });
    expect(doneRecipesButton).toBeInTheDocument();

    userEvent.click(doneRecipesButton);

    expect(history.location.pathname).toEqual('/done-recipes');
  });
  it('testa se ao clicar no botão "Favorite Recipes" a página é redirecionada para receitas favoritas', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const imgProfile = screen.queryByTestId(/profile-top-btn/i);
    expect(imgProfile).toBeInTheDocument();

    userEvent.click(imgProfile);

    expect(history.location.pathname).toEqual('/profile');

    const favoriteRecipesButton = screen.queryByRole('button', { name: /favorite recipes/i });
    expect(favoriteRecipesButton).toBeInTheDocument();

    userEvent.click(favoriteRecipesButton);

    expect(history.location.pathname).toEqual('/favorite-recipes');
  });
  it('testa se ao clicar no botão "Logout" a página é redirecionada para login e se o localStorage é esvaziado', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const imgProfile = screen.queryByTestId(/profile-top-btn/i);
    expect(imgProfile).toBeInTheDocument();

    userEvent.click(imgProfile);

    expect(history.location.pathname).toEqual('/profile');

    const logoutButton = screen.queryByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    userEvent.click(logoutButton);

    const clearLocalStorage = localStorage.clear();
    expect(clearLocalStorage).toBeUndefined();

    expect(history.location.pathname).toEqual('/');
  });
  it('testa se ao clicar no botão "Logout" a página é redirecionada para login e se o localStorage é esvaziado', async () => {
    const { history } = renderWithRouter(<App />);
    history.push('/profile');

    const loading = screen.getByRole('heading', { level: 2, name: /carregando/i });
    expect(loading).toBeInTheDocument();
  });
});
