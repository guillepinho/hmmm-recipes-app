import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import logIn from './helpers/logIn';
import { apiMockInitialMealsRecipes, mockFirstLetter, mockApiNameOneResultDrink, apiMockInitialDrinksRecipes, apiMockCategoryMeals, apiMockCategoryDrinks, apiCorba, apiGG, apiBurek, apiB52 } from './helpers/apiMocks';

const MEALS_CATEGORY_LIST_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const MEALS_CORBA_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52977';
const DRINKS_CATEGORY_LIST_URL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const DRINK_GG_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997';
const MEAL_BUREK_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=53060';
const CORBADETAILS = '/meals/52977';
const CORBAINPROGRESS = '/meals/52977/in-progress';
const GGINPROGRESS = '/drinks/15997/in-progress';
const STARTRECIPEBUTTON = 'start-recipe-btn';
const FINISHRECIPEBUTTON = 'finish-recipe-btn';
const URLDONERECIPES = '/done-recipes';
const URLB52 = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15853';

fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=', apiMockInitialMealsRecipes);
fetchMock.mock(MEALS_CATEGORY_LIST_URL, apiMockCategoryMeals);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=', apiMockInitialDrinksRecipes);
fetchMock.mock(DRINKS_CATEGORY_LIST_URL, apiMockCategoryDrinks);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?f=a', mockFirstLetter);
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Zorro', mockApiNameOneResultDrink);
fetchMock.mock('https://www.themealdb.com/api/json/v1/1/search.php?s=adsadsa', { meals: null });
fetchMock.mock('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15328', mockApiNameOneResultDrink);
fetchMock.mock(URLB52, apiB52);
fetchMock.mock(MEALS_CORBA_URL, apiCorba);
fetchMock.mock(DRINK_GG_URL, apiGG);
fetchMock.mock(MEAL_BUREK_URL, apiBurek);

describe('Testing RecipeinProgress Component', () => {
  it('Testa se renderiza o componente em progresso com comida', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const corba = screen.queryByText(/corba/i);
    expect(corba).toBeInTheDocument();

    userEvent.click(corba);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBADETAILS);
    history.push(CORBAINPROGRESS);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });
    const corbaTitle = screen.queryByRole('heading', { level: 1 });
    expect(corbaTitle).toBeInTheDocument();
  });
  it('Testa se renderiza o componente em progresso com bebida', async () => {
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const drinkIcon = screen.queryByAltText(/drink-icon/i);
    expect(drinkIcon).toBeInTheDocument();

    userEvent.click(drinkIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/drinks');

    const gg = screen.queryByText('GG');
    expect(gg).toBeInTheDocument();
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    expect(history.location.pathname).toEqual(GGINPROGRESS);
  });
  it('Testa se os ingredientes são salvos e removidos no localStorage', async () => {
    localStorage.clear();
    const valueLocalStorage = '{"drinks":{"15997":["Galliano"]},"meals":{}}';
    const removeValueLocalStorage = '{"drinks":{"15997":[]},"meals":{}}';
    const { history } = renderWithRouter(<App />);
    logIn();

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const drinkIcon = screen.queryByAltText(/drink-icon/i);
    expect(drinkIcon).toBeInTheDocument();

    userEvent.click(drinkIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/drinks');

    const gg = screen.queryByText('GG');
    expect(gg).toBeInTheDocument();
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual(GGINPROGRESS);
    const ggTitle = screen.queryByRole('heading', { level: 1 });
    expect(ggTitle).toBeInTheDocument();

    const allCheckBox = screen.getAllByTestId(/ingredient-step/i);
    expect(allCheckBox).toHaveLength(3);

    userEvent.click(allCheckBox[0]);
    const storage = localStorage.getItem('inProgressRecipes');
    expect(storage).toEqual(valueLocalStorage);

    userEvent.click(allCheckBox[0]);
    const storage2 = localStorage.getItem('inProgressRecipes');
    expect(storage2).toEqual(removeValueLocalStorage);
  });
  it('Testa se ao clicar no finish Recipes muda o localStorage', async () => {
    const valueLocalStorageDone = '[{"id":"15997","type":"drink","nationality":"","category":"Ordinary Drink","alcoholicOrNot":"Optional alcohol","name":"GG","image":"https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg","doneDate":"30/9/2022","tags":[]}]';

    const { history } = renderWithRouter(<App />);
    logIn();
    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const drinkIcon = screen.queryByAltText(/drink-icon/i);
    expect(drinkIcon).toBeInTheDocument();

    userEvent.click(drinkIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/drinks');

    const gg = screen.queryByText('GG');
    expect(gg).toBeInTheDocument();
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual(GGINPROGRESS);
    const ggTitle = screen.queryByRole('heading', { level: 1 });
    expect(ggTitle).toBeInTheDocument();

    const allCheckBox = screen.getAllByTestId(/ingredient-step/i);
    expect(allCheckBox).toHaveLength(3);

    userEvent.click(allCheckBox[0]);
    userEvent.click(allCheckBox[1]);
    userEvent.click(allCheckBox[2]);

    const finishRecipesButton = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton).toBeInTheDocument();

    userEvent.click(finishRecipesButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const storage3 = localStorage.getItem('doneRecipes');
    expect(storage3).toEqual(valueLocalStorageDone);
  });
  it('Testa se ao clicar no finish Recipes muda o localStorage de meal', async () => {
    localStorage.clear();
    const valueLocalStorageDone = '[{"id":"52977","type":"meal","nationality":"","category":"Side","alcoholicOrNot":"","name":"Corba","image":"https://www.themealdb.com/images/media/meals/58oia61564916529.jpg","doneDate":"30/9/2022","tags":["Soup"]}]';

    const { history } = renderWithRouter(<App />);
    logIn();
    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const corba = screen.getByText(/corba/i);
    userEvent.click(corba);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBADETAILS);

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBAINPROGRESS);
    const corbaTitle = screen.queryByRole('heading', { level: 1 });
    expect(corbaTitle).toBeInTheDocument();

    const allCheckBox = screen.getAllByTestId(/ingredient-step/i);
    expect(allCheckBox).toHaveLength(13);
    allCheckBox.forEach((ingredients) => userEvent.click(ingredients));

    const finishRecipesButton = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton).toBeInTheDocument();

    userEvent.click(finishRecipesButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const storage3 = localStorage.getItem('doneRecipes');
    expect(storage3).toEqual(valueLocalStorageDone);
  });
  it('Testa se ao salvar mais de duas receitas elas estão salvas no localStorage', async () => {
    localStorage.clear();
    const valueLocalStorageDone = '[{"id":"52977","type":"meal","nationality":"","category":"Side","alcoholicOrNot":"","name":"Corba","image":"https://www.themealdb.com/images/media/meals/58oia61564916529.jpg","doneDate":"30/9/2022","tags":["Soup"]},{"id":"15997","type":"drink","nationality":"","category":"Ordinary Drink","alcoholicOrNot":"Optional alcohol","name":"GG","image":"https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg","doneDate":"30/9/2022","tags":[]}]';

    const { history } = renderWithRouter(<App />);
    logIn();
    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const corba = screen.getByText(/corba/i);
    userEvent.click(corba);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBADETAILS);

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBAINPROGRESS);
    const corbaTitle = screen.queryByRole('heading', { level: 1 });
    expect(corbaTitle).toBeInTheDocument();

    const allCheckBox = screen.getAllByTestId(/ingredient-step/i);
    expect(allCheckBox).toHaveLength(13);
    allCheckBox.forEach((ingredients) => userEvent.click(ingredients));

    const finishRecipesButton = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton).toBeInTheDocument();

    userEvent.click(finishRecipesButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const profile = screen.getByTestId('profile-top-btn');

    userEvent.click(profile);

    const drinkIcon = screen.queryByAltText(/drink-icon/i);
    expect(drinkIcon).toBeInTheDocument();

    userEvent.click(drinkIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/drinks');

    const gg = screen.queryByText('GG');
    expect(gg).toBeInTheDocument();
    userEvent.click(gg);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual('/drinks/15997');

    const startRecipeButton2 = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton2).toBeInTheDocument();
    userEvent.click(startRecipeButton2);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual(GGINPROGRESS);
    const ggTitle = screen.queryByRole('heading', { level: 1 });
    expect(ggTitle).toBeInTheDocument();

    const allCheckBoxGG = screen.getAllByTestId(/ingredient-step/i);
    allCheckBoxGG.forEach((ingredients) => userEvent.click(ingredients));

    const finishRecipesButton1 = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton1).toBeInTheDocument();

    userEvent.click(finishRecipesButton1);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINK_GG_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const storage4 = localStorage.getItem('doneRecipes');
    expect(storage4).toEqual(valueLocalStorageDone);
  });
  it('Testa se ao salvar mais de duas receitas elas estão salvas no localStorage', async () => {
    localStorage.clear();
    const valueLocalStorageDone = '[{"id":"52977","type":"meal","nationality":"","category":"Side","alcoholicOrNot":"","name":"Corba","image":"https://www.themealdb.com/images/media/meals/58oia61564916529.jpg","doneDate":"30/9/2022","tags":["Soup"]},{"id":"53060","type":"meal","nationality":"","category":"Side","alcoholicOrNot":"","name":"Burek","image":"https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg","doneDate":"30/9/2022","tags":["Streetfood"," Onthego"]}]';
    const { history } = renderWithRouter(<App />);
    logIn();
    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const corba = screen.getByText(/corba/i);
    userEvent.click(corba);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBADETAILS);

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(CORBAINPROGRESS);
    const corbaTitle = screen.queryByRole('heading', { level: 1 });
    expect(corbaTitle).toBeInTheDocument();

    const allCheckBox = screen.getAllByTestId(/ingredient-step/i);
    expect(allCheckBox).toHaveLength(13);
    allCheckBox.forEach((ingredients) => userEvent.click(ingredients));

    const finishRecipesButton = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton).toBeInTheDocument();

    userEvent.click(finishRecipesButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CORBA_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const profile = screen.getByTestId('profile-top-btn');

    userEvent.click(profile);

    const mealIcon = screen.queryByAltText(/meal-icon/i);
    expect(mealIcon).toBeInTheDocument();

    userEvent.click(mealIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    const burek = screen.getByText(/burek/i);
    userEvent.click(burek);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEAL_BUREK_URL);
    });

    expect(history.location.pathname).toEqual('/meals/53060');

    const startRecipeButton1 = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton1).toBeInTheDocument();
    userEvent.click(startRecipeButton1);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEAL_BUREK_URL);
    });

    expect(history.location.pathname).toEqual('/meals/53060/in-progress');
    const burekTitle = screen.queryByRole('heading', { level: 1 });
    expect(burekTitle).toBeInTheDocument();

    const allCheckBox1 = screen.getAllByTestId(/ingredient-step/i);
    allCheckBox1.forEach((ingredients) => userEvent.click(ingredients));

    const finishRecipesButton1 = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton1).toBeInTheDocument();

    userEvent.click(finishRecipesButton1);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEAL_BUREK_URL);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const storage4 = localStorage.getItem('doneRecipes');
    expect(storage4).toEqual(valueLocalStorageDone);

    expect(JSON.parse(localStorage.doneRecipes)[0].type).toBe('meal');
  });
  it('Testa se caso o retorno da api de bebidas contenha a chave tags com strings elas são salvas', async () => {
    localStorage.clear();
    const valueLocalStorageDone = '[{"id":"15853","type":"drink","nationality":"","category":"Shot","alcoholicOrNot":"Alcoholic","name":"B-52","image":"https://www.thecocktaildb.com/images/media/drink/5a3vg61504372070.jpg","doneDate":"30/9/2022","tags":["IBA","NewEra"]}]';

    const { history } = renderWithRouter(<App />);
    logIn();
    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(MEALS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/meals');

    const drinkIcon = screen.queryByAltText(/drink-icon/i);
    expect(drinkIcon).toBeInTheDocument();

    userEvent.click(drinkIcon);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(DRINKS_CATEGORY_LIST_URL);
    });

    expect(history.location.pathname).toEqual('/drinks');

    const B52 = screen.getByRole('heading', { name: /b-52/i });
    expect(B52).toBeInTheDocument();
    userEvent.click(B52);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(URLB52);
    });

    const startRecipeButton = screen.getByTestId(STARTRECIPEBUTTON);
    expect(startRecipeButton).toBeInTheDocument();
    userEvent.click(startRecipeButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(URLB52);
    });

    expect(history.location.pathname).toEqual('/drinks/15853/in-progress');
    const B52Title = screen.getByRole('heading', { name: /b-52/i });
    expect(B52Title).toBeInTheDocument();

    const allCheckBox = screen.getAllByRole('checkbox');
    expect(allCheckBox).toHaveLength(3);

    allCheckBox.forEach((checkbox) => userEvent.click(checkbox));

    const finishRecipesButton = screen.getByTestId(FINISHRECIPEBUTTON);
    expect(finishRecipesButton).toBeInTheDocument();

    userEvent.click(finishRecipesButton);

    await waitFor(() => {
      expect(fetchMock.lastUrl()).toEqual(URLB52);
    });

    expect(history.location.pathname).toEqual(URLDONERECIPES);

    const storage3 = localStorage.getItem('doneRecipes');
    expect(storage3).toEqual(valueLocalStorageDone);
  });
});
