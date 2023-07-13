import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Categories from './Categories';
import categoriesSlice from '../../store/categories';

describe('Categories', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        categories: categoriesSlice,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Categories />
      </Provider>
    );

    expect(getByTestId('categoryContainer')).toBeInTheDocument();
  });

  it('loads categories on mount', () => {
    render(
      <Provider store={store}>
        <Categories />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('dispatches the changeActiveCategory action when a category is clicked', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Categories />
      </Provider>
    );

    fireEvent.click(getByTestId('paper_someCategory'));

    expect(store.dispatch).toHaveBeenCalledWith(
      categoriesSlice.actions.changeActiveCategory('someCategory')
    );
  });

  // Add more tests as necessary...
});
