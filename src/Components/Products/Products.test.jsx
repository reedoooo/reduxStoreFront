import Products from './index';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import storefrontReducer from '../../store';

import { render, screen } from '@testing-library/react';
import thunk from 'redux-thunk';

describe('Testing Products component...', () => {

  test('All products should be visible when no active category set', () => {

    const store = createStore(storefrontReducer, applyMiddleware(thunk));

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    expect(screen.getByText('Dry Food')).toBeVisible;
    expect(screen.getByText('Wet Food')).toBeVisible;
    expect(screen.getByText('Leash')).toBeVisible;
    expect(screen.getByText('Collar')).toBeVisible;
  });

  test('Can only see food products when food category is active', () => {

    const store = createStore(storefrontReducer, applyMiddleware(thunk));

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    store.dispatch({
      type: 'SET_ACTIVECATEGORY',
      payload: 'food'
    });

    expect(screen.getByText('Dry Food')).toBeVisible;
    expect(screen.getByText('Wet Food')).toBeVisible;
    expect(screen.getByText('Leash')).not.toBeVisible;
    expect(screen.getByText('Collar')).not.toBeVisible;
  });

  test('Can only see accessories products when accessories category is active', () => {

    const store = createStore(storefrontReducer, applyMiddleware(thunk));

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    );

    store.dispatch({
      type: 'SET_ACTIVECATEGORY',
      payload: 'accessories'
    });

    expect(screen.getByText('Dry Food')).not.toBeVisible;
    expect(screen.getByText('Wet Food')).not.toBeVisible;
    expect(screen.getByText('Leash')).toBeVisible;
    expect(screen.getByText('Collar')).toBeVisible;
  });



});
