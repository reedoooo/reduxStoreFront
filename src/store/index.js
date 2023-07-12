import categoriesSlice from './categories';
import cartSlice from './cart';
import productsSlice from './products';
import { combineReducers } from 'redux';

const storefrontReducer = combineReducers({
  categories: categoriesSlice.reducer,
  products: productsSlice.reducer,
  cart: cartSlice.reducer,
});

export default storefrontReducer;

// import categoriesSlice from './categories';
// import cartSlice from './cart';
// import { combineReducers } from 'redux';
// import productsSlice from './products';

// const storefrontReducer = combineReducers({
//   categories: categoriesSlice.reducer,
//   products: productsSlice.reducer,
//   cart: cartSlice.reducer,
// });

// export default storefrontReducer;
