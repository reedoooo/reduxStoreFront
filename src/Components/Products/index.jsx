import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography as Text,
  CardMedia,
  Container,
  Button,
  styled,
} from '@mui/material';
import { loadProductsFromAPI, addProductToCart } from '../../store/products';
import { adjustStockOnServer } from '../../store/cart';

const CustomCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: 300,
  margin: '1rem',
  boxShadow: theme.shadows[3],
}));

function Products() {
  const productData = useSelector(
    (storefrontState) => storefrontState.products
  );
  const categoryData = useSelector(
    (storefrontState) => storefrontState.categories
  );
  const cartData = useSelector((storefrontState) => storefrontState.cart);
  const dispatch = useDispatch();

  const handleAddProductToCart = (product) => {
    if (!cartData.items.find((item) => item._id === product._id)) {
      dispatch(addProductToCart(product));
    } else {
      dispatch(adjustStockOnServer(product, 1));
    }
  };

  useEffect(() => {
    dispatch(loadProductsFromAPI()).then((response) =>
      dispatch(loadProductsFromAPI.actions.setAllProducts(response.results))
    );
  }, [dispatch]);

  return (
    <Container id="productListingContainer">
      {categoryData.activeCategory && categoryData.activeCategory.name
        ? productData.allProducts
          ? productData.allProducts.map((product) => {
            if (product.category === categoryData.activeCategory.name) {
              return (
                <CustomCard key={`${product.name}_card`}>
                  <CardHeader
                    title={product.name}
                    subheader={`$${product.price}`}
                  />
                  <CardMedia
                    sx={{ height: 100 }}
                    image="https://placehold.co/200.png"
                  />
                  <CardContent>
                    <Text variant="body2">{product.description}</Text>
                  </CardContent>
                  <CardActions>
                    {product.inStock > 0 ? (
                      <Button
                        variant="contained"
                        onClick={() => handleAddProductToCart(product)}
                      >
                          Add To Basket
                      </Button>
                    ) : (
                      <Button disabled variant="contained">
                          Sold Out
                      </Button>
                    )}
                    <Button variant="contained">
                      <RouterLink
                        to={`/products/${product?._id}`}
                        style={{ textDecoration: 'none' }}
                        state={{ product: product }}
                      >
                          More Details
                      </RouterLink>
                    </Button>
                  </CardActions>
                </CustomCard>
              );
            }
            return null;
          })
          : null
        : productData.allProducts
          ? productData.allProducts.map((product) => {
            return (
              <CustomCard key={`${product.name}_card`}>
                <CardHeader
                  title={product.name}
                  subheader={`$${product.price}`}
                />
                <CardMedia
                  sx={{ height: 100 }}
                  image="https://placehold.co/200.png"
                />
                <CardContent>
                  <Text variant="body2">{product.description}</Text>
                </CardContent>
                <CardActions>
                  {product.inStock > 0 ? (
                    <Button
                      variant="contained"
                      onClick={() => handleAddProductToCart(product)}
                    >
                      Add To Basket
                    </Button>
                  ) : (
                    <Button disabled variant="contained">
                      Sold Out
                    </Button>
                  )}
                  <Button variant="contained">
                    <RouterLink
                      to={`/products/${product?._id}`}
                      style={{ textDecoration: 'none' }}
                      state={{ product: product }}
                    >
                      More Details
                    </RouterLink>
                  </Button>
                </CardActions>
              </CustomCard>
            );
          })
          : null}
    </Container>
  );
}

export default Products;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";

// import { Card, CardActions, CardContent, CardHeader, Typography, CardMedia, Container, Button } from "@mui/material";

// import productsSlice from "../../store/products";
// import cartSlice from "../../store/cart";
// import { modifyServerSideStock } from "../../store/cart";
// import { addItemToCart, fetchProductsFromServer } from "../../store/products";

// function Products() {

//   const productState = useSelector(storefrontState => storefrontState.products);
//   const categoryState = useSelector(storefrontState => storefrontState.categories);
//   const cartState = useSelector(storefrontState => storefrontState.cart);
//   const dispatch = useDispatch();

//   let {setAllProducts} = productsSlice.actions;
//   let {addToCart} = cartSlice.actions;

//   const handleAddToCart = (product) => {
//     // if product IS NOT in cart, add it to cart
//     if (!cartState.items.find(item => item._id === product._id)) {
//       dispatch(addItemToCart(product._id))
//       .then(dispatch(addToCart(product)));
//     }
//     // otherwise, the product IS in the cart and we need to update the quantity of the item
//     else {
//       dispatch(modifyServerSideStock(product, 1));
//     }
//   }

//   // fetches product data when component mounts (when page loads)
//   useEffect(() => {
//     dispatch(fetchProductsFromServer())
//     .then(response => dispatch(setAllProducts(response.results)));
//   },
//   // eslint-disable-next-line
//   [])

//   // fetches product data from the server any time our cart is modified so that the state stays in sync with whats on the server
//   useEffect(() => {
//     dispatch(fetchProductsFromServer())
//     .then(results => dispatch(setAllProducts(results.results)));
//   },
//   // eslint-disable-next-line
//   [cartState])

//   return(

//     <Container key='productsContainer' id='productsContainer'>
//     {categoryState.activeCategory.name ?
//       // displays products only if they match the active category
//       productState.allProducts.map(product => {

//         if(product.category === categoryState.activeCategory.name){

//           return <Card key={`${product.name}_card`} sx={{width: 300, height: 300, margin: '1rem'}}>
//             <CardHeader
//               title={product.name}
//               subheader={`$${product.price}`}
//             />
//             <CardMedia
//               sx={{height: 100}}
//               image='https://placehold.co/200.png'
//             />
//             <CardContent>
//               <Typography variant="body2">
//                 {product.description}
//               </Typography>
//             </CardContent>
//             <CardActions>
//               {product.inStock > 0 ?
//                 <Button variant="contained" onClick={() => handleAddToCart(product)}>
//                   Add To Cart
//                 </Button>
//               :
//                 <Button disabled variant="contained">Out of Stock</Button>
//               }
//               <Button variant='contained'>
//                 <Link
//                   to={`/products/${product?._id}`}
//                   style={{textDecoration: 'none'}}
//                   state={{product: product}}
//                 >
//                   Details
//                 </Link>
//               </Button>
//             </CardActions>
//           </Card>

//         }
//         return null;
//       })

//     :
//       // displays all products when there is no active category
//       productState.allProducts.map(product => {
//         return <Card key={`${product.name}_card`} sx={{width: 300, height: 300, margin: '1rem'}}>
//           <CardHeader
//             title={product.name}
//             subheader={`$${product.price}`}
//           />
//           <CardMedia
//             sx={{height: 100}}
//             image='https://placehold.co/200.png'
//           />
//           <CardContent>
//             <Typography variant="body2">
//               {product.description}
//             </Typography>
//           </CardContent>
//           <CardActions>
//             {product.inStock > 0 ?
//               <Button variant="contained" onClick={() => handleAddToCart(product)}>
//                 Add To Cart
//               </Button>
//             :
//               <Button disabled variant="contained">Out of Stock</Button>
//             }
//             <Button variant='contained'>
//               <Link
//                 to={`/products/${product?._id}`}
//                 style={{textDecoration: 'none'}}
//                 state={{product: product}}
//               >
//                 Details
//               </Link>
//             </Button>
//           </CardActions>
//         </Card>
//       })}
//     </Container>
//   )

// }

// export default Products;
// // export { handleAddToCart }
