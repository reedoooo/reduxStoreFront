import categoriesSlice from './categories';
import cartSlice from './cart';
import productSlice from './products';
import { combineReducers } from 'redux';

const storefrontReducer = combineReducers({
  categories: categoriesSlice.reducer,
  products: productSlice.reducer,
  cart: cartSlice.reducer
});

export default storefrontReducer;
