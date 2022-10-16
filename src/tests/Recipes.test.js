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
const APAM_BALIK = 'Apam balik';

fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=', apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);
fetchMock.mock(DESSERT_URL, apiMockDesserts);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/lookup.php?i=53049', apiApamBalik);
fetchMock.mock(INITIAL_DRINKS_URL, apiMockInitialDrinksRecipes);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list', apiMockCategoryDrinks);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocoa', apiCocoa);

describe('Testing Recipes component', () => {
  it('testa se a página é renderizada com as 12 primeiras receitas', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const imgs = screen.queryAllByTestId(/card-img/i);
    expect(imgs).toHaveLength(12);
  });

  it('testa se ao clicar em um filtro, as meals mudam e posso clicar no primeiro card', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const dessertButton = screen.getByTestId('Dessert-category-filter');
    userEvent.click(dessertButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DESSERT_URL);
    });

    const apamBalik = screen.queryByText(APAM_BALIK);
    expect(apamBalik).toBeInTheDocument();

    userEvent.click(apamBalik);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    expect(history.location.pathname).toEqual('/meals/53049');
    const apamBalikTitle = screen.queryByText(APAM_BALIK);
    expect(apamBalikTitle).toBeInTheDocument();
  });

  it('testa se ao clicar em um filtro, as drinks mudam e se é possível ao clicar novamente no mesmo filtro, ele é removido', async () => {
    renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const drinkButton = screen.getByAltText('drink-icon');
    userEvent.click(drinkButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    });

    const gg = screen.queryByText('GG');
    expect(gg).toBeInTheDocument();

    const cocoaButton = screen.queryByTestId(/Cocoa-category-filter/i);
    userEvent.click(cocoaButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocoa');
    });

    const castillian = screen.queryByText('Castillian Hot Chocolate');
    expect(castillian).toBeInTheDocument();

    userEvent.click(cocoaButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    expect(gg).toBeInTheDocument();
  });

  it('testa se ao clicar em um filtro, as comidas mudam e se ao clicar no botão "All", os filtros são resetados', async () => {
    renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const dessertButton = screen.getByTestId('Dessert-category-filter');
    userEvent.click(dessertButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DESSERT_URL);
    });

    const apamBalik = screen.queryByText(APAM_BALIK);
    expect(apamBalik).toBeInTheDocument();

    const allButton = screen.getByRole('button', { name: /all/i });
    userEvent.click(allButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    });

    const bigMac = screen.queryByText(/big mac/i);
    expect(bigMac).toBeInTheDocument();
  });
});
