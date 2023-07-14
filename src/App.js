import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import shopReducer from './store';
import TopBar from './Components/Header';
import BottomBar from './Components/Footer';
import ShopFront from './Components/Storefront';
import Cart from './Components/ShoppingCart';

import { configureStore as createStoreWithReducer } from '@reduxjs/toolkit';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Container as MuiContainer } from '@mui/material';
import SingleProduct from './Components/ProductDetails';

let shopStore = createStoreWithReducer({
  reducer: shopReducer,
});

const App = () => {
  return (
    <ReduxProvider store={shopStore}>
      <TopBar />
      <Router>
        <MuiContainer component="main" id="mainContainer">
          <Routes>
            <Route path="/" element={<ShopFront />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MuiContainer>
      </Router>
      <BottomBar />
    </ReduxProvider>
  );
};

export default App;

// import React from "react";
// import { Provider } from "react-redux";
// import storefrontReducer from "./store";
// import Header from "./Components/Header";
// import Footer from "./Components/Footer";
// import Storefront from "./Components/Storefront";
// import ShoppingCart from "./Components/ShoppingCart";
// import { configureStore } from "@reduxjs/toolkit";

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { Container } from "@mui/material";
// import ProductDetails from "./Components/ProductDetails";

// // const storeFront = createStore(storefrontReducer, applyMiddleware(thunk));
// let storeFront = configureStore({reducer: storefrontReducer})

// function App() {
//   return (
//     <Provider store={storeFront}>
//       <Header />
//       <BrowserRouter>
//         <Container component='main' id='mainContainer'>
//           <Routes>
//             <Route path="/" element={<Storefront />} />
//             <Route path='/products/:id' element={<ProductDetails />} />
//             <Route path="/cart" element={<ShoppingCart />} />
//           </Routes>
//         </Container>
//       </BrowserRouter>
//       <Footer />
//     </Provider>
//   );
// }

// export default App;
