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
import { loadProductsFromAPI } from '../../store/products';
import {
  addProductToCart,
  changeProductQuantity,
  removeProductFromCart,
} from '../../store/cart';

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
    console.log('handleAddProductToCart - product: ', product);

    if (!product || typeof product !== 'object') {
      console.error('Invalid product');
      return;
    }

    const productInCart = cartData.items?.find(
      (item) => item._id === product._id
    );

    if (!productInCart) {
      // Add the product to the cart before changing the quantity
      dispatch(addProductToCart(product));
      dispatch(changeProductQuantity({ id: product._id, quantityChange: 1 }));
    } else {
      const quantityChange = 1;
      dispatch(changeProductQuantity({ id: product._id, quantityChange }));
    }
  };

  // In your Products function, add the removeProductFromCart handler
  const handleRemoveProductFromCart = (product) => {
    console.log('handleRemoveProductFromCart - product: ', product);

    if (!product || typeof product !== 'object') {
      console.error('Invalid product');
      return;
    }

    dispatch(removeProductFromCart(product));
  };
  useEffect(() => {
    dispatch(loadProductsFromAPI());
  }, [dispatch]);

  const renderProductCard = (product) => (
    <CustomCard key={`${product.name}_card`}>
      <CardHeader title={product.name} subheader={`$${product.price}`} />
      <CardMedia sx={{ height: 100 }} image="https://placehold.co/200.png" />
      <CardContent>
        <Text variant="body2">{product.description}</Text>
      </CardContent>
      <CardActions>
        {product.inStock > 0 ? (
          <Button
            variant="contained"
            onClick={() => handleAddProductToCart(product)}
          >
            Add To Cart
          </Button>
        ) : (
          <Button disabled variant="contained">
            Sold Out
          </Button>
        )}
        {product.inStock > 0 ? (
          <Button
            variant="contained"
            onClick={() => handleRemoveProductFromCart(product)}
          >
            Remove From Cart
          </Button>
        ) : (
          <Button disabled variant="contained">
            Cannot Remove
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

  const productList = categoryData.selectedCategory?.name
    ? productData.productList.flatMap((listItem) =>
      listItem.products.filter(
        (product) => product.category === categoryData.selectedCategory.name
      )
    )
    : productData.productList.flatMap((listItem) => listItem.products);

  return (
    <Container id="productListingContainer">
      {productList.map((product, index) => (
        <React.Fragment key={product._id || index}>
          {renderProductCard(product)}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default Products;
