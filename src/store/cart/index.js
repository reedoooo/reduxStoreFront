// Importing the createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Asynchronously replenish product stock in server-side database
export const replenishStockInServer = (product) => async () => {
  // Convert product ID to a string
  const id = String(product._id);

  // Fetch the product data from the server
  const response = await fetch(`http://localhost:3001/api/products/${id}`);
  console.log('store, cart, replenishStockInServer, response', response);

  // Parse the JSON response
  const existingProduct = await response.json();

  // Calculate new stock amount
  const updateBody = { inStock: existingProduct.inStock + product.quantity };

  // Send a PUT request to update the product stock on the server
  await fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(updateBody),
  });
};

// Asynchronously adjust product stock on server-side database based on quantity change
// Asynchronously adjust product stock on server-side database based on quantity change
export const adjustStockOnServer =
  ({ id, quantityChange }) =>
    async () => {
      try {
      // Fetch the product data from the server
        const response = await fetch(`http://localhost:3001/api/products/${id}`);

        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const productData = await response.json();

        // Check for sufficient stock before adding to cart
        if (quantityChange > 0 && productData.inStock <= 0) {
          throw new Error(
            'Cannot add more items to your cart. Item might be out of stock.'
          );
        }

        // Calculate new stock amount after change
        const updateBody = { inStock: productData.inStock + quantityChange };

        // Send a PUT request to update the product stock on the server
        const updateResponse = await fetch(
          `http://localhost:3001/api/products/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(updateBody),
          }
        );

        // Check if the update response is okay
        if (!updateResponse.ok) {
          throw new Error(`HTTP error! status: ${updateResponse.status}`);
        }
      } catch (error) {
        console.error('A problem occurred while adjusting the stock:', error);
      }
    };

// Create a Redux slice for cart operations
const cartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    products: [],
    totalAmount: 0,
    cartVisible: false,
  },
  reducers: {
    // Reducer to add a product to cart
    addProductToCart(state, action) {
      const product = action.payload;
      let newItem = {
        _id: product._id,
        category: product.category,
        name: product.name,
        price: product.price,
        quantity: 1,
      };

      // Add new item to products array and update total cart amount
      state.products = [...state.products, newItem];
      state.totalAmount += product.price;
    },

    // Reducer to remove a product from cart
    removeProductFromCart(state, action) {
      let filteredItems = state.products.filter(
        (product) => product._id !== action.payload._id
      );

      // Update total amount after product removal
      let updatedTotal = filteredItems.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );

      state.products = filteredItems;
      state.totalAmount = updatedTotal;
    },

    // Reducer to change the quantity of a product in cart
    // changeProductQuantity(state, action) {
    // Reducer to change the quantity of a product in cart
    changeProductQuantity(state, action) {
      const { id, quantityChange } = action.payload;
      console.log(
        'changeProductQuantity - id, quantityChange: ',
        id,
        quantityChange
      );

      let currentItems = [...state.products];
      let targetItem = currentItems.find((item) => item._id === id);

      if (targetItem) {
        targetItem.quantity += quantityChange;

        if (targetItem.quantity === 0) {
          currentItems = state.products.filter((item) => item._id !== id);
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

    // Reducer to toggle cart visibility
    toggleCartVisibility(state) {
      state.cartVisible = !state.cartVisible;
    },
  },
});

// Export all cart actions
export const {
  addProductToCart,
  removeProductFromCart,
  changeProductQuantity,
  toggleCartVisibility,
} = cartSlice.actions;

// Export the slice reducer
export default cartSlice;
