import React from 'react';
import { useLocation as usePageLocation } from 'react-router';
import {
  Card as CardElement,
  CardActions,
  CardContent,
  CardHeader,
  Typography as Text,
  CardMedia,
  Box as BoxElement,
  Button as ButtonElement,
  styled
} from '@mui/material';
import { addProductToCart, changeProductQuantity } from '../../store/cart';
import {
  useDispatch as useActionDispatcher,
  useSelector as useStoreSelector
} from 'react-redux';

const CustomCard = styled(CardElement)(({ theme }) => ({
  width: '45%',
  height: '100%',
  alignSelf: 'center',
  boxShadow: theme.shadows[3]
}));

function SingleProduct() {
  const cartData = useStoreSelector((storefrontState) => storefrontState.cart);
  let { state } = usePageLocation();
  const dispatcher = useActionDispatcher();
  const handleAddProductToCart = (product) => {
    console.log('handleAddProductToCart - product: ', product);

    if (!product || typeof product !== 'object') {
      console.error('Invalid product');
      return;
    }

    // Generate unique key for each product
    const uniqueProductId = `${product._id}_${Date.now()}_${Math.random()}`;
    product._id = uniqueProductId;

    const productInCart = cartData.items?.find(
      (item) => item._id === product._id
    );
    console.log('handleAddProductToCart - productInCart: ', productInCart);
    if (!productInCart) {
      dispatcher(addProductToCart(product));
      dispatcher(changeProductQuantity({ id: product._id, quantityChange: 1 }));
    } else {
      const quantityChange = 1;
      dispatcher(changeProductQuantity({ id: product._id, quantityChange }));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <CustomCard>
        <CardHeader
          title={state.product.name}
          subheader={state.product.category}
        />
        <CardMedia
          sx={{ height: 400, margin: '1rem' }}
          image="https://placehold.co/500.png"
        />
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="h6" sx={{ color: 'grey' }}>
            {`Available: ${state.product.inStock}`}
          </Text>
          <Text variant="h6">{`$${state.product.price}`}</Text>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          {state.product.inStock > 0 ? (
            <ButtonElement
              variant="contained"
              onClick={() => handleAddProductToCart(state.product)}
              sx={{ width: '100%' }}
            >
              {'Add To Basket'}
            </ButtonElement>
          ) : (
            <ButtonElement disabled>Sold Out</ButtonElement>
          )}
        </CardActions>
      </CustomCard>
      <BoxElement sx={{ width: '45%' }}>
        <p>Ratings: </p>
        <p>Similar Items: </p>
      </BoxElement>
    </div>
  );
}

export default SingleProduct;
