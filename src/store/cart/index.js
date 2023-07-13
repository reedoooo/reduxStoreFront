import { createSlice } from '@reduxjs/toolkit';

export const replenishStockInServer = (product) => async () => {
  const response = await fetch(
    `http://localhost:3001/api/products/${product._id}`
  );
  const existingProduct = await response.json();

  const updateBody = { inStock: existingProduct.inStock + product.quantity };

  await fetch(`http://localhost:3001/api/products/${product._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(updateBody),
  });
};

export const adjustStockOnServer = (product, changeInQuantity) => async () => {
  const response = await fetch(
    `http://localhost:3001/api/products/${product._id}`
  );
  const productData = await response.json();

  if (changeInQuantity > 0 && productData.inStock <= 0) {
    throw new Error(
      'Cannot add more items to your cart. Item might be out of stock.'
    );
  }

  const updateBody = { inStock: productData.inStock - changeInQuantity };

  await fetch(`http://localhost:3001/api/products/${product._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(updateBody),
  });
};

const cartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    products: [],
    totalAmount: 0,
    cartVisible: false,
  },
  reducers: {
    addProductToCart(state, action) {
      let newItem = {
        _id: action.payload._id,
        category: action.payload.category,
        name: action.payload.name,
        price: action.payload.price,
        quantity: 1,
      };
      state.products = [...state.products, newItem];
      state.totalAmount += action.payload.price;
    },
    removeProductFromCart(state, action) {
      let filteredItems = state.products.filter(
        (product) => product._id !== action.payload._id
      );
      let updatedTotal = filteredItems.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );
      state.products = filteredItems;
      state.totalAmount = updatedTotal;
    },
    changeProductQuantity(state, action) {
      let currentItems = [...state.products];
      let targetItem = currentItems.find(
        (item) => item.name === action.payload.product.name
      );
      targetItem.quantity += action.payload.quantityChange;

      if (targetItem.quantity === 0) {
        currentItems = state.products.filter(
          (item) => item.name !== action.payload.product.name
        );
      }

      let updatedTotal = currentItems.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );
      state.products = currentItems;
      state.totalAmount = updatedTotal;
    },
    toggleCartVisibility(state) {
      state.cartVisible = !state.cartVisible;
    },
  },
});

export const {
  addProductToCart,
  removeProductFromCart,
  changeProductQuantity,
  toggleCartVisibility
} = cartSlice.actions;

export default cartSlice;
