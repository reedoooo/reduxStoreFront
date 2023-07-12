import Categories from './index';
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import storefrontReducer from '../../store';
import { render, screen, fireEvent, act } from '@testing-library/react';
import thunk from 'redux-thunk';
// import userEvent from "@testing-library/user-event";

describe('Testing Categories component...', () => {

  test('Categories component should be visible', () => {
    const store = createStore(storefrontReducer, applyMiddleware(thunk));
    let categoryState = store.getState().categories;

    render(
      <Provider store={store}>
        <Categories categories={categoryState.categories}/>
      </Provider>
    )

    expect(screen.getByTestId('paper_food')).toBeVisible();
    expect(screen.getByTestId('paper_accessories')).toBeVisible();
  })

  test('Simulating changing active category', () => {
    const store = createStore(storefrontReducer, applyMiddleware(thunk));
    let categoryState = store.getState().categories;

    render(
      <Provider store={store}>
        <Categories categories={categoryState.categories}/>
      </Provider>
    )
    
    act(() => store.dispatch({
      type:'SET_ACTIVECATEGORY',
      payload: 'food'
    }))

    expect(store.getState().categories.activeCategory.name).toBe('food')

    act(() => store.dispatch({
      type:'SET_ACTIVECATEGORY',
      payload: ''
    }))

    expect(store.getState().categories.activeCategory?.name).toBeFalsy();
  })

})