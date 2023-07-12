import { createSlice } from '@reduxjs/toolkit';

export const loadProductsFromAPI = () => async () => {
  const apiResponse = await fetch('http://localhost:3001/api/products');
  const productsData = await apiResponse.json();

  return productsData;
};

export const addProductToCart = (productId) => async () => {
  // Retrieve product details from server
  const apiResponse = await fetch(
    `http://localhost:3001/api/products/${productId}`
  );
  const productDetails = await apiResponse.json();

  // Check if product is available in stock
  if (productDetails.inStock <= 0) {
    console.error('This product is out of stock');
  } else {
    // Adjust stock details on server side
    const updatedDetails = { inStock: productDetails.inStock - 1 };
    await fetch(`http://localhost:3001/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(updatedDetails),
    });
  }
};

const productSlice = createSlice({
  name: 'productData',
  initialState: {
    productList: [],
  },
  reducers: {
    loadAllProducts(state, action) {
      state.productList = action.payload;
    },
  },
});

export default productSlice;

// import { createSlice } from "@reduxjs/toolkit";

// export const fetchProductsFromServer = () => async () => {
//   let response = await fetch('http://localhost:3001/api/products');
//   let data = await response.json();

//   return data;
// }

// export const addItemToCart = (productId) => async () => {

//   // find product on server side
//   let response = await fetch(`http://localhost:3001/api/products/${productId}`);
//   let product = await response.json()

//   // check if product is in stock
//   if (product.inStock <= 0){
//     console.error('Item is no longer in stock')
//   }

//   else {
//     // update stock on server side
//     let body = {inStock: product.inStock - 1};
//     await fetch(`http://localhost:3001/api/products/${productId}`, {
//       method: 'PUT',
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify(body)
//     });
//   }
// }

// const productsSlice = createSlice({
//   name: 'products',
//   initialState: {
//     allProducts: [],
//   },
//   reducers: {
//     setAllProducts(state, action){
//       state.allProducts = action.payload;
//     },
//   }
// })

// export default productsSlice;
