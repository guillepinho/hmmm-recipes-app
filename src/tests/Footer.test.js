import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';

describe('Testing Footer component', () => {
  it('testa se aparece dois links na tela', () => {
    const EMAIL = 'teste@trybe.com';
    const PASSWORD = '1234567';
    const { history } = renderWithRouter(<App />);
    const inputEmail = screen.getByRole('textbox');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toBeInTheDocument();

    const inputButton = screen.getByRole('button', {
      name: /enter/i,
    });
    expect(inputButton).toBeInTheDocument();

    userEvent.type(inputEmail, EMAIL);
    userEvent.type(inputPassword, PASSWORD);
    userEvent.click(inputButton);

    expect(history.location.pathname).toEqual('/meals');

    const drinkLink = screen.getByTestId('drinks-bottom-btn');
    const mealsLink = screen.getByTestId('meals-bottom-btn');
    expect(drinkLink).toBeInTheDocument();
    expect(mealsLink).toBeInTheDocument();
  });
});
