import Footer from './index';
import { render, screen } from '@testing-library/react';
// import userEvent from "@testing-library/user-event";

describe('Testing Footer component...', () => {
  test('Footer should be visible', () => {
    render(<Footer />);

    expect(screen.getByText('Author: Reed Vogt || github.com/reedoooo'))
      .toBeVisible;
  });
});
