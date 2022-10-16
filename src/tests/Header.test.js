import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import logIn from './helpers/logIn';
import { apiMockInitialMealsRecipes, mockFirstLetter, mockApiNameOneResultDrink, apiMockInitialDrinksRecipes, apiMockCategoryMeals, apiMockCategoryDrinks } from './helpers/apiMocks';

const PROFILE_ICON = 'profile-icon';
const SEARCH_ICON = 'search-icon';
const SEARCH_INPUT = 'search-input';
const SEARCH_BUTTON_TEXT = 'Search';

const MEALS_CATEGORY_LIST_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=', apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=', apiMockInitialDrinksRecipes);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list', apiMockCategoryDrinks);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?f=a', mockFirstLetter);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Zorro', mockApiNameOneResultDrink);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=adsadsa', { meals: null });
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15328', mockApiNameOneResultDrink);

describe('Testing Header Component', () => {
  it('testa se são exibidos os botões de perfil e o search e se ao clicar no botão profile é levado à página de perfil', () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    const imgProfile = screen.queryByAltText(PROFILE_ICON);
    expect(imgProfile).toBeInTheDocument();

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    expect(imgSearch).toBeInTheDocument();

    userEvent.click(imgProfile);

    expect(history.location.pathname).toEqual('/profile');
  });

  it('testa se ao clicar no botão search, aparece a respectiva barra', () => {
    renderWithRouter(<App />);
    logIn();

    const imgProfile = screen.queryByAltText(PROFILE_ICON);
    expect(imgProfile).toBeInTheDocument();

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    expect(imgSearch).toBeInTheDocument();

    userEvent.click(imgSearch);

    const input = screen.queryByTestId(SEARCH_INPUT);
    expect(input).toBeInTheDocument();
    const inputSearch = screen.queryAllByRole('textbox');
    expect(inputSearch).toHaveLength(1);

    const inputRadios = screen.queryAllByRole('radio');
    expect(inputRadios).toHaveLength(3);
  });

  it('testa se aparece um alerta ao digitar mais de uma letra na barra, quando a pesquisa selecionada for "First Letter"', () => {
    renderWithRouter(<App />);
    logIn();

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    userEvent.click(imgSearch);

    const alertMock = jest.spyOn(global, 'alert').mockImplementation();

    const inputSearch = screen.queryByRole('textbox');
    const firstLetter = screen.queryByRole('radio', { name: /first letter/i });
    const button = screen.queryByRole('button', { name: SEARCH_BUTTON_TEXT });

    userEvent.type(inputSearch, 'ab');
    userEvent.click(firstLetter);
    userEvent.click(button);

    expect(alertMock).toHaveBeenCalledTimes(1);
  });

  it('testa se aparece um alerta se a busca não retornar nenhuma receita', async () => {
    renderWithRouter(<App />);
    logIn();

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    userEvent.click(imgSearch);

    const alertMock = jest.spyOn(global, 'alert').mockImplementation();

    const inputSearch = screen.queryByRole('textbox');
    const nameRadio = screen.queryByRole('radio', { name: /name/i });
    const button = screen.queryByRole('button', { name: SEARCH_BUTTON_TEXT });

    userEvent.type(inputSearch, 'adasdsadsa');
    userEvent.click(nameRadio);
    userEvent.click(button);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledTimes(1);
    });
  });

  it('testa se é possível ao preencher o "form" é feita uma requisição à API e ela gera dados na tela', async () => {
    renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    userEvent.click(imgSearch);

    const inputSearch = screen.queryByRole('textbox');
    const firstLetter = screen.queryByRole('radio', { name: /first letter/i });
    const button = screen.queryByRole('button', { name: SEARCH_BUTTON_TEXT });

    userEvent.type(inputSearch, 'a');
    userEvent.click(firstLetter);
    userEvent.click(button);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
    });

    const firstRecipe = screen.queryByText('Apple Frangipan Tart');
    expect(firstRecipe).toBeInTheDocument();
  });

  it('testa se o resultado for apenas uma bebida, o usuário é redirecionado à respectiva página', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const drinkButton = screen.getByAltText('drink-icon');
    userEvent.click(drinkButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    });

    const imgSearch = screen.queryByAltText(SEARCH_ICON);
    userEvent.click(imgSearch);

    const inputSearch = screen.queryByRole('textbox');
    const name = screen.queryByRole('radio', { name: /name/i });
    const button = screen.queryByRole('button', { name: SEARCH_BUTTON_TEXT });

    screen.debug();

    userEvent.type(inputSearch, 'Zorro');
    userEvent.click(name);
    userEvent.click(button);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Zorro');
    });

    expect(history.location.pathname).toEqual('/drinks/15328');
  });
});
