import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // You need to install this library
import SimpleCart from './SimpleCart';

const mockStore = configureStore([]);
let store;
let component;

describe('SimpleCart', () => {
  beforeEach(() => {
    store = mockStore({
      cart: {
        showCart: true,
        items: [
          { name: 'Item 1', quantity: 1 },
          { name: 'Item 2', quantity: 2 },
        ],
        total: 5.0,
      },
    });

    // Provides the store to your App
    component = render(
      <Provider store={store}>
        <SimpleCart />
      </Provider>,
    );
  });

  it('renders without crashing', () => {
    expect(component).toBeTruthy();
  });

  it('renders correct quantity for each item in cart', () => {
    const { getByText } = component;
    expect(getByText('Item 1 x 1')).toBeInTheDocument();
    expect(getByText('Item 2 x 2')).toBeInTheDocument();
  });

  it('renders total price correctly', () => {
    const { getByText } = component;
    expect(getByText('SubTotal: $5.00')).toBeInTheDocument();
  });

  // Note: Due to the complexity of Redux async action creators,
  // testing button click actions here is non-trivial and would require a good deal of setup.
  // These would likely best be tested in your action creators or Redux slice files themselves.
});
