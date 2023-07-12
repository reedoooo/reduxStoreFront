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

const cartSliceCreator = createSlice({
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

export default cartSliceCreator;

// import { createSlice } from "@reduxjs/toolkit";

// export const reStockServer = (product) => async () => {
//   // find product on server side
//   let response = await fetch(
//     `http://localhost:3001/api/products/${product._id}`
//   );
//   let foundProduct = await response.json();

//   // update stock on server side
//   let body = { inStock: foundProduct.inStock + product.quantity };
//   await fetch(`http://localhost:3001/api/products/${product._id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(body),
//   });
// };

// export const modifyServerSideStock = (product, quantityChange) => async () => {
//   // find cart item id in server products
//   let response = await fetch(
//     `http://localhost:3001/api/products/${product._id}`
//   );
//   let foundProduct = await response.json();

//   // if we are trying to increment an item's quantity in our cart AND the product is out of stock, then we throw an error
//   if (quantityChange > 0 && foundProduct.inStock <= 0) {
//     throw new Error(
//       "Unable to add more of this item to your cart. Item may be out of stock."
//     );
//   }

//   // update server side stock
//   let body = { inStock: foundProduct.inStock - quantityChange };

//   await fetch(`http://localhost:3001/api/products/${product._id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     body: JSON.stringify(body),
//   });
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//     total: 0,
//     showCart: false,
//   },
//   reducers: {
//     addToCart(state, action) {
//       let item = {
//         _id: action.payload._id,
//         category: action.payload.category,
//         name: action.payload.name,
//         price: action.payload.price,
//         quantity: 1,
//       };
//       state.items = [...state.items, item];
//       state.total = state.total + action.payload.price;
//     },
//     removeFromCart(state, action) {
//       // filter array so that the remaining items are the ones that DO NOT MATCH the id of the item we want to remove
//       let remainingItems = state.items.filter(
//         (item) => item._id !== action.payload._id
//       );

//       // recalculate the total
//       let newTotal = remainingItems.reduce((acc, current) => {
//         return acc + current.price * current.quantity;
//       }, 0);

//       // set state
//       state.items = remainingItems;
//       state.total = newTotal;
//     },
//     modifyItemQuantity(state, action) {
//       console.log("MODIFY: ", action);
//       let cartItems = [...state.items];

//       let foundItem = cartItems.find(
//         (item) => item.name === action.payload.product.name
//       );

//       foundItem.quantity += action.payload.quantityChange;

//       if (foundItem.quantity === 0) {
//         cartItems = state.items.filter(
//           (item) => item.name !== action.payload.product.name
//         );
//       }

//       let modifiedTotal = cartItems.reduce((acc, current) => {
//         return acc + current.price * current.quantity;
//       }, 0);

//       state.items = cartItems;
//       state.total = modifiedTotal;
//     },
//     toggleShowCart(state, action) {
//       state.showCart = !state.showCart;
//     },
//   },
// });

// export default cartSlice;
