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
  Box,
} from '@mui/material';
import { loadProductsFromAPI } from '../../store/products';
import {
  addProductToCart,
  changeProductQuantity,
  removeProductFromCart,
  replenishStockInServer,
} from '../../store/cart';

const CustomCard = styled(Card)(({ theme }) => ({
  width: '45%',
  height: '100%',
  margin: '1rem',
  boxShadow: theme.shadows[3],
  position: 'relative',
}));

const ProductDetailsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: theme.palette.common.white,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&:hover': {
    opacity: 1,
  },
}));

function Products() {
  const productData = useSelector(
    (storefrontState) => storefrontState.products,
  );
  const categoryData = useSelector(
    (storefrontState) => storefrontState.categories,
  );
  const cartData = useSelector((storefrontState) => storefrontState.cart);
  const dispatch = useDispatch();

  const handleAddProductToCart = (product, index) => {
    if (!product || typeof product !== 'object') {
      console.error('Invalid product');
      return;
    }

    const productWithKey = {
      ...product,
      key: `${product.id}-${index}`,
    };

    const productInCart = cartData.items?.find(
      (item) => item.key === productWithKey.key,
    );

    if (!productInCart) {
      dispatch(addProductToCart(productWithKey));
      dispatch(
        changeProductQuantity({ id: productWithKey.key, quantityChange: 1 }),
      );
    } else {
      const quantityChange = 1;
      dispatch(
        changeProductQuantity({ id: productWithKey._id, quantityChange }),
      );
    }
  };

  const handleRemoveProductFromCart = (product) => {
    dispatch(removeProductFromCart(product));
    dispatch(replenishStockInServer(product));
  };

  useEffect(() => {
    dispatch(loadProductsFromAPI());
  }, [dispatch]);

  const renderProductCard = (product, index) => (
    <CustomCard key={`${product.id}-${index}`}>
      <CardHeader title={product.name} subheader={`$${product.price}`} />
      <CardMedia sx={{ height: 100 }} image="https://placehold.co/200.png" />
      <CardContent>
        <Text variant="body2">{product.description}</Text>
      </CardContent>
      <ProductDetailsOverlay>
        <Text variant="h6">{product.details}</Text>
      </ProductDetailsOverlay>
      <CardActions>
        {product.inStock > 0 ? (
          <Button
            variant="contained"
            onClick={() => handleAddProductToCart(product, index)}
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
            onClick={() => handleRemoveProductFromCart(product, index)}
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
          (product) => product.category === categoryData.selectedCategory.name,
        ),
      )
    : productData.productList.flatMap((listItem) => listItem.products);

  return (
    <Container
      id="productListingContainer"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {productList.map((product, index) => (
        <React.Fragment key={`${product.id}-${index}`}>
          {renderProductCard(product, index)}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default Products;
