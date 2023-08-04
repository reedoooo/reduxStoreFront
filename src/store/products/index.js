// Importing the createSlice function from Redux Toolkit
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Asynchronously load products from server-side API
export const loadProductsFromAPI = () => async (dispatch) => {
  console.log('Starting to load products from API');

  try {
    // Fetch all products from the server
    const apiResponse = await fetch(
      `${process.env.REACT_APP_SERVER}/api/products`
    );
    console.log('API response received');

    // Error handling for unsuccessful fetch
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    // Parse the JSON response
    let productsData = await apiResponse.json();
    console.log('Products data received and parsed');

    // Assign a unique key to each product
    productsData = productsData.map((product, index) => ({
      ...product,
      key: `${index}_${Math.random()}`
    }));
    console.log('Unique key assigned to each product');

    // Dispatch loadAllProducts action to update Redux store
    dispatch(productSlice.actions.loadAllProducts(productsData));
    console.log('All products loaded into Redux store');
  } catch (error) {
    console.error('Fetching products failed: ', error);
  }
};

// Asynchronously add a new product to the server-side database
export const addProductToDatabase = (productData) => async () => {
  console.log('Starting to add a product to the database');

  // Send a POST request to add the product to the server
  const response = await fetch(`${process.env.REACT_APP_SERVER}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });

  // Parse the JSON response
  const data = await response.json();
  console.log('Product added to the database', data);
};

// Asynchronously delete product from server-side database
export const deleteProductFromDatabase = (productId) => async () => {
  console.log('Starting to delete a product from the database');

  try {
    // Send a DELETE request to remove the product from the server
    const response = await fetch(
      `${process.env.REACT_APP_SERVER}/api/products/${productId.toString()}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Deleting product failed: ', error);
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
    `${process.env.REACT_APP_SERVER}/api/products/${productId.toString()}`
  );
  const productDetails = await apiResponse.json();
  console.log('store, products, productDetails', productDetails);

  // Check for sufficient stock before adding to cart
  if (productDetails.inStock <= 0) {
    console.error('This product is out of stock');
  } else {
    // Calculate new stock amount after addition to cart
    const updatedDetails = { inStock: productDetails.inStock - 1 };
    console.log('New stock amount calculated', updatedDetails);

    // Send a PUT request to update the product stock on the server
    await fetch(
      `${process.env.REACT_APP_SERVER}/api/products/${productId.toString()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(updatedDetails)
      }
    );

    console.log('Product stock updated on the server');
  }
};

// Asynchronously replenish product stock in server-side database
export const replenishStockInServer = createAsyncThunk(
  'shoppingCart/replenishStockInServer',
  async (product, { rejectWithValue }) => {
    try {
      console.log('Starting to replenish product stock in server');

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

      console.log('Product stock replenished in server');

      return existingProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Asynchronously adjust product stock on server-side database based on quantity change
export const adjustStockOnServer =
  ({ id, quantityChange }) =>
  async () => {
    try {
      console.log('Starting to adjust product stock on server');

      // Fetch the product data from the server
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/api/products/${id}`
      );

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

      // Check if the update response is okay
      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      console.log('Product stock adjusted on server');
    } catch (error) {
      console.error('A problem occurred while adjusting the stock:', error);
    }
  };

// Create a Redux slice for product operations
const productSlice = createSlice({
  name: 'productData',
  initialState: {
    productList: []
  },
  reducers: {
    // Reducer to load all products into the Redux store
    loadAllProducts(state, action) {
      state.productList = action.payload;
    }
  }
});

// Export loadAllProducts action
export const { loadAllProducts } = productSlice.actions;

// Export the slice reducer
export default productSlice;
