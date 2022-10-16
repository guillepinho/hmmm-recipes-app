import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function logIn() {
  const inputButton = screen.getByRole('button', {
    name: /enter/i,
  });
  const inputEmail = screen.getByRole('textbox');
  const inputPassword = screen.getByPlaceholderText(/digite senha/i);
  userEvent.type(inputEmail, 'teste@hotmail.com');
  userEvent.type(inputPassword, '1234567');
  userEvent.click(inputButton);
}

export default logIn;
