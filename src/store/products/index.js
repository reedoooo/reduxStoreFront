// Importing the createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Asynchronously load products from server-side API
export const loadProductsFromAPI = () => async (dispatch) => {
  try {
    // Fetch all products from the server
    const apiResponse = await fetch('http://localhost:3001/api/products');

    // Error handling for unsuccessful fetch
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    // Parse the JSON response
    const productsData = await apiResponse.json();

    // Dispatch loadAllProducts action to update Redux store
    dispatch(productSlice.actions.loadAllProducts(productsData));
  } catch (error) {
    console.error('Fetching products failed: ', error);
  }
};

// Asynchronously adjust product stock on server-side database when adding to cart
export const adjustStockOnAddingToCart = (productId) => async () => {
  console.log(
    'store, products, adjustStockOnAddingToCart, productId',
    productId
  );

  // Fetch specific product details from the server
  const apiResponse = await fetch(
    `http://localhost:3001/api/products/${productId.toString()}`
  );
  const productDetails = await apiResponse.json();
  console.log('store, products, productDetails', productDetails);

  // Check for sufficient stock before adding to cart
  if (productDetails.inStock <= 0) {
    console.error('This product is out of stock');
  } else {
    // Calculate new stock amount after addition to cart
    const updatedDetails = { inStock: productDetails.inStock - 1 };

    // Send a PUT request to update the product stock on the server
    await fetch(`http://localhost:3001/api/products/${productId.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(updatedDetails),
    });
  }
};

// Asynchronously add a new product to the server-side database
export const addProductToDatabase = (productData) => async () => {
  // Send a POST request to add the product to the server
  const response = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  // Parse the JSON response
  const data = await response.json();
  console.log('store, products, data', data);
};

// Asynchronously delete product from server-side database
export const deleteProductFromDatabase = (productId) => async () => {
  try {
    // Send a DELETE request to remove the product from the server
    const response = await fetch(`http://localhost:3001/api/products/${productId.toString()}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('store, products, product deleted successfully');
  } catch (error) {
    console.error('Deleting product failed: ', error);
  }
};


// Create a Redux slice for product operations
const productSlice = createSlice({
  name: 'productData',
  initialState: {
    productList: [],
  },
  reducers: {
    // Reducer to load all products into the Redux store
    loadAllProducts(state, action) {
      state.productList = action.payload;
    },
  },
});

// Export loadAllProducts action
export const { loadAllProducts } = productSlice.actions;

// Export the slice reducer
export default productSlice;
