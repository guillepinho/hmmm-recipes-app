import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import Login from '../pages/Login';

describe('Test the Login js', () => {
  it('testar a renderizacao do componente Login', () => {
    renderWithRouter(<Login />);
    // screen.logTestingPlaygroundURL();
    const inputEmail = screen.getByRole('textbox');
    expect(inputEmail).toBeInTheDocument();
    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toBeInTheDocument();
  });
  it('testar se o botao continua desabilitado com email invalido', () => {
    renderWithRouter(<Login />);
    const inputButton = screen.getByRole('button', {
      name: /enter/i,
    });
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toHaveValue('');
    expect(inputEmail).toHaveValue('');
    userEvent.type(inputEmail, 'testegmail');
    userEvent.type(inputPassword, '123456');
    expect(inputPassword).toHaveValue('123456');
    expect(inputEmail).toHaveValue('testegmail');
    expect(inputButton).toBeDisabled();
  });
  it('testar se o botao continua desabilitado com password invalido', () => {
    renderWithRouter(<Login />);
    const inputButton = screen.getByRole('button', {
      name: /enter/i,
    });
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toHaveValue('');
    expect(inputEmail).toHaveValue('');
    userEvent.type(inputEmail, 'teste@gmail.com');
    userEvent.type(inputPassword, '12345');
    expect(inputPassword).toHaveValue('12345');
    expect(inputEmail).toHaveValue('teste@gmail.com');
    expect(inputButton).toBeDisabled();
  });
  it('testar se o botao habilita com email e password válido', () => {
    renderWithRouter(<Login />);
    const inputButton = screen.getByRole('button', {
      name: /enter/i,
    });
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toHaveValue('');
    expect(inputEmail).toHaveValue('');
    userEvent.type(inputEmail, 'teste@hotmail2.com');
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword).toHaveValue('1234567');
    expect(inputEmail).toHaveValue('teste@hotmail2.com');
    expect(inputButton).toBeEnabled();
  });
  it('testar se redireciona para a tela de receitas de comida quando clica no botao', () => {
    const { history } = renderWithRouter(<Login />);
    const inputButton = screen.getByRole('button', {
      name: /enter/i,
    });
    const inputEmail = screen.getByRole('textbox');
    const inputPassword = screen.getByPlaceholderText(/digite senha/i);
    expect(inputPassword).toHaveValue('');
    expect(inputEmail).toHaveValue('');
    userEvent.type(inputEmail, 'teste@hotmail.com');
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword).toHaveValue('1234567');
    expect(inputEmail).toHaveValue('teste@hotmail.com');
    expect(inputButton).toBeEnabled();
    userEvent.click(inputButton);
    history.push('/meals');
    expect(history.location.pathname).toBe('/meals');
  });
});
