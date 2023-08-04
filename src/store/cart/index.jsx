// Importing necessary modules and functions
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const replenishStockInServer = createAsyncThunk(
  'shoppingCart/replenishStockInServer',
  async (product, { rejectWithValue }) => {
    try {
      const id = String(product._id);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/api/products/${id}`
      );
      const existingProduct = await response.json();
      const updateBody = {
        inStock: existingProduct.inStock + product.quantity
      };
      await fetch(`${process.env.REACT_APP_SERVER}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(updateBody)
      });
      return existingProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adjustStockOnServer = createAsyncThunk(
  'shoppingCart/adjustStockOnServer',
  async ({ id, quantityChange }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/api/products/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const productData = await response.json();

      if (quantityChange > 0 && productData.inStock <= 0) {
        throw new Error(
          'Cannot add more items to your cart. Item might be out of stock.'
        );
      }

      const updateBody = { inStock: productData.inStock + quantityChange };
      const updateResponse = await fetch(
        `${process.env.REACT_APP_SERVER}/api/products/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(updateBody)
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      return productData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    products: [],
    totalAmount: 0,
    cartVisible: false
  },
  reducers: {
    addProductToCart(state, action) {
      const product = action.payload;
      const existingProductIndex = state.products.findIndex(
        (prod) => prod.key === product.key
      );

      if (existingProductIndex >= 0) {
        state.products[existingProductIndex].quantity += 1;
      } else {
        const newItem = {
          key: product.key,
          category: product.category,
          name: product.name,
          price: product.price,
          quantity: 1
        };
        state.products = [...state.products, newItem];
      }

      state.totalAmount += product.price;
    },

    removeProductFromCart(state, action) {
      let filteredItems = state.products.filter(
        (product) => product.key !== action.payload.key
      );

      let updatedTotal = filteredItems.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );

      state.products = filteredItems;
      state.totalAmount = updatedTotal;
    },

    changeProductQuantity(state, action) {
      const { id, quantityChange } = action.payload;
      let currentItems = [...state.products];
      let targetItem = currentItems.find((item) => item.key === id);

      if (targetItem) {
        targetItem.quantity += quantityChange;

        if (targetItem.quantity === 0) {
          currentItems = state.products.filter((item) => item.key !== id);
        }

        let updatedTotal = currentItems.reduce(
          (acc, current) => acc + current.price * current.quantity,
          0
        );

        state.products = currentItems;
        state.totalAmount = updatedTotal;
      } else {
        console.warn(`Item with id ${id} not found in cart`);
      }
    },

    toggleCartVisibility(state) {
      state.cartVisible = !state.cartVisible;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(replenishStockInServer.fulfilled, (state, action) => {
        console.log('Product stock replenished', action.payload);
      })
      .addCase(replenishStockInServer.rejected, (state, action) => {
        console.error('Failed to replenish stock', action.payload);
      });
  }
});

export const {
  addProductToCart,
  removeProductFromCart,
  changeProductQuantity,
  toggleCartVisibility
} = cartSlice.actions;

export default cartSlice;
