import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import logIn from './helpers/logIn';
import { apiMockInitialMealsRecipes, apiMockCategoryMeals, apiGG, apiMockInitialDrinksRecipes, apiMockCategoryDrinks, apiCorba } from './helpers/apiMocks';

// CONSTANTES DO TESTE
const MEALS_CATEGORY_LIST_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const DRINKS_CATEGORY_LIST_URL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const INITIAL_DRINKS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const INITIAL_MEALS_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const MEAL_CORBA_PATHNAME = '/meals/52977';
const DRINK_GG_PATHNAME = '/drinks/15997';
const LOCAL_STORAGE_WITH_CORBA = '[{"id":"52977","type":"meal","nationality":"Turkish","category":"Side","alcoholicOrNot":"","name":"Corba","image":"https://www.themealdb.com/images/media/meals/58oia61564916529.jpg"}]';
const START_RECIPE_BTN = 'start-recipe-btn';

// SETUP DOS MOCKS
fetchMock.mock(INITIAL_MEALS_URL, apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);
fetchMock.mock(INITIAL_DRINKS_URL, apiMockInitialDrinksRecipes);
fetchMock.mock(DRINKS_CATEGORY_LIST_URL, apiMockCategoryDrinks);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52977', apiCorba);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997', apiGG);

// MOCK DO CLIPBOARD
Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});
jest.spyOn(navigator.clipboard, 'writeText');

// TESTES

describe('Testing Recipe Details component', () => {
  it('Testa se a página é gerada com todas as informações', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(MEAL_CORBA_PATHNAME);
    expect(history.location.pathname).toEqual(MEAL_CORBA_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    const title = screen.queryByRole('heading', { level: 1, name: /corba/i });
    const img = screen.queryByAltText(/corba/i);
    const buttonShare = screen.queryByTestId(/share-btn/i);
    const buttonFav = screen.queryByTestId('favorite-btn');
    const ingredients = screen.queryAllByTestId(/name-and-measure/i);
    const instructions = screen.queryByTestId('instructions');
    const video = screen.queryByTestId('video');
    const recommendations = screen.queryAllByTestId(/recommendation-card/i);

    expect(title).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(buttonShare).toBeInTheDocument();
    expect(buttonFav).toBeInTheDocument();
    expect(ingredients).toHaveLength(13);
    expect(instructions).toBeInTheDocument();
    expect(video).toBeInTheDocument();
    expect(recommendations).toHaveLength(6);
  });

  it('Testa se é possível copiar o link da página ao clicar no botão de compartilhar', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(MEAL_CORBA_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    const buttonShare = screen.queryByTestId(/share-btn/i);
    userEvent.click(buttonShare);

    const linkCopied = screen.queryByText(/Link copied!/i);
    expect(linkCopied).toBeInTheDocument();
  });

  it('Testa se é possível favoritar a receita, mudando o ícone do botão, bem como se a receita fica salva e depois é excluída do localStorage', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(MEAL_CORBA_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    const buttonFav = screen.queryByTestId('favorite-btn');
    expect(buttonFav).toBeInTheDocument();
    userEvent.click(buttonFav);

    const favs = localStorage.getItem('favoriteRecipes');
    expect(favs).toEqual(LOCAL_STORAGE_WITH_CORBA);

    userEvent.click(buttonFav);
    const emptyFavs = localStorage.getItem('favoriteRecipes');
    expect(emptyFavs).toEqual('[]');
  });

  it('Testa se a funcionalidade do botão "Start Recipe", e se ao retornar à página o botão aparece comoc "Continue Recipe"', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(MEAL_CORBA_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    const startButton = screen.getByTestId(START_RECIPE_BTN);
    userEvent.click(startButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52977');
    });

    expect(history.location.pathname).toEqual('/meals/52977/in-progress');

    history.push(MEAL_CORBA_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_DRINKS_URL);
    });

    const continueButton = screen.queryByText('Continue Recipe');
    expect(continueButton).toBeInTheDocument();
  });

  it('Testa as mesmas funcionalidades com as bebidas', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const drinkButton = screen.getByAltText('drink-icon');
    userEvent.click(drinkButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    const gg = screen.queryByText('GG');
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_MEALS_URL);
    });

    const startButton = screen.getByTestId(START_RECIPE_BTN);
    userEvent.click(startButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997');
    });

    expect(history.location.pathname).toEqual('/drinks/15997/in-progress');

    history.push(DRINK_GG_PATHNAME);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_MEALS_URL);
    });

    const continueButton = screen.queryByText('Continue Recipe');
    expect(continueButton).toBeInTheDocument();
  });

  it('Testa se o botão de "Start Recipe" some, quando a receita já foi elaborada', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([{ id: '15997', type: 'drink' }]));
    renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const drinkButton = screen.getByAltText('drink-icon');
    userEvent.click(drinkButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    const gg = screen.queryByText('GG');
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(INITIAL_MEALS_URL);
    });

    const startButton = screen.queryByTestId(START_RECIPE_BTN);
    expect(startButton).not.toBeInTheDocument();
  });
});
