import { render, screen } from '@testing-library/react';
import App from './App';

test('renders current time', () => {
  render(<App />);
  const linkElement = screen.getByText(/September 30th 2021/);
  expect(linkElement).toBeInTheDocument();
});
