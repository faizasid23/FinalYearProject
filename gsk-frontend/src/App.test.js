/***************************************************************************************
*    Title: How to Write Your First Unit Test in React + TypeScript App
*    Author: Alex Bespoyasov
*    Date: 2021
*    Code version: 2.0
*    Availability: https://www.newline.co/@bespoyasov/how-to-write-your-first-unit-test-in-react-typescript-app--ca51d0c0
*
***************************************************************************************/
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
