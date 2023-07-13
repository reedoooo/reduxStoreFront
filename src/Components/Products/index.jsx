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
import { changeProductQuantity } from '../../store/cart';

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
    if (cartData.items && !cartData.items.find((item) => item._id === product._id)) {
      dispatch(addProductToCart(product._id));
    } else {
      dispatch(changeProductQuantity(product, 1));
    }
  };


  useEffect(() => {
    dispatch(loadProductsFromAPI());
  }, [dispatch]);

  return (
    <Container id="productListingContainer">
      {categoryData.selectedCategory && categoryData.selectedCategory.name
        ? productData.productList
          ? productData.productList.flatMap((listItem) =>
            listItem.products.map((product) => {
              if (product.category === categoryData.selectedCategory.name) {
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
          )
          : null
        : productData.productList
          ? productData.productList.flatMap((listItem) =>
            listItem.products.map((product) => {
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
          )
          : null}
    </Container>
  );
}

export default Products;
