import React from 'react';
import { screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import logIn from './helpers/logIn';
import { apiMockInitialMealsRecipes, apiMockCategoryMeals } from './helpers/apiMocks';

// CONSTANTES DO TESTE
const MEALS_CATEGORY_LIST_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const FAVORITE_RECIPES_URL = '/favorite-recipes';

// SETUP DOS MOCKS
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=', apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);

// MOCKING STORAGE FOR TESTS
const mockedFavRecipe = [{ id: '52977', type: 'meal', nationality: 'Turkish', category: 'Side', alcoholicOrNot: '', name: 'Corba', image: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg' }, { id: '15997', type: 'drink', nationality: '', category: 'Ordinary Drink', alcoholicOrNot: 'Optional alcohol', name: 'GG', image: 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg' }];

// MOCK DO CLIPBOARD
Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});
jest.spyOn(navigator.clipboard, 'writeText');

// AFTER EACH
afterEach(() => {
  localStorage.removeItem('favoriteRecipes');
});

describe('Testing FavoriteRecipes page', () => {
  it('testa se a página é renderizada com todos os componentes esperados', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockedFavRecipe));
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(FAVORITE_RECIPES_URL);

    await waitFor(() => {
      const imgs = screen.queryAllByTestId(/horizontal-image/i);
      expect(imgs).toHaveLength(2);
      expect(localStorage.getItem('favoriteRecipes')).toEqual(JSON.stringify(mockedFavRecipe));
    });
  });

  it('testa se é gerado um storage vazio, quando não há chave gerada', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(FAVORITE_RECIPES_URL);

    await waitFor(() => {
      const imgs = screen.queryAllByTestId(/horizontal-image/i);
      expect(imgs).toHaveLength(0);
      expect(localStorage.getItem('favoriteRecipes')).toEqual(null);
    });
  });

  it('testa se ao clicar no botão de compartilhar, a URL é copiada e aparece um texto na tela', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockedFavRecipe));
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(FAVORITE_RECIPES_URL);

    await waitFor(() => {
      const shareBtn = screen.queryByTestId(/0-horizontal-share-btn/i);
      userEvent.click(shareBtn);

      const linkCopied = screen.queryByText(/link copied/i);
      expect(linkCopied).toBeInTheDocument();
    });
  });

  it('testa se ao clicar no botão de compartilhar, a URL é copiada e aparece um texto na tela', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockedFavRecipe));
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(FAVORITE_RECIPES_URL);

    const removeFav = await screen.findByTestId(/0-horizontal-favorite-btn/i);
    userEvent.click(removeFav);

    const imgs = screen.queryAllByTestId(/horizontal-image/i);
    expect(imgs).toHaveLength(1);

    expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toHaveLength(1);
  });

  it('testa os botões de filtro', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockedFavRecipe));
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    history.push(FAVORITE_RECIPES_URL);

    await waitFor(() => {
      const imgs = screen.queryAllByTestId(/horizontal-image/i);
      expect(imgs).toHaveLength(2);
    });

    const corba = await screen.findByText(/corba/i);
    const gg = await screen.findByText(/gg/i);
    const allFilterBut = await screen.findByTestId('filter-by-all-btn');
    const mealsFilterBut = await screen.findByRole('button', { name: /meals/i });
    const drinksFilterBut = await screen.findByRole('button', { name: /drinks/i });

    userEvent.click(mealsFilterBut);

    await waitFor(() => {
      expect(gg).not.toBeInTheDocument();
    });

    userEvent.click(drinksFilterBut);

    await waitFor(() => {
      expect(corba).not.toBeInTheDocument();
    });

    userEvent.click(allFilterBut);

    await waitFor(() => {
      const imgs2 = screen.queryAllByTestId(/horizontal-image/i);
      expect(imgs2).toHaveLength(2);
    });

    // Corba e GG
  });
});
