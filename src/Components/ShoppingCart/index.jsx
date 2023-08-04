import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  Card as CardElement,
  CardContent,
  Typography,
  Box,
  Button,
  // TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import cartSlice, {
  adjustStockOnServer as modifyServerSideStock,
  replenishStockInServer as reStockServer,
} from '../../store/cart';

// function CustomTextField({ id = 'outlined', label, type }) {
//   return <TextField id={id} label={label} type={type} />;
// }

function ShoppingCart() {
  const { toggleCartVisibility, removeProductFromCart, changeProductQuantity } =
    cartSlice.actions;
  const cartState = useSelector((storefrontState) => storefrontState.cart);
  const dispatch = useDispatch();

  if (!cartState.cartVisible) {
    return null;
  }

  const handleRemoveItem = async (product) => {
    try {
      await dispatch(reStockServer(product)).unwrap();
      dispatch(removeProductFromCart(product));
    } catch (error) {
      console.error('Failed to replenish stock on server: ', error);
    }
  };

  const handleModifyItemInCart = async (event, product) => {
    let quantityChange = parseInt(event.target.value);

    // Make sure the value is either 1 or -1
    if (quantityChange > 1) {
      quantityChange = 1;
    } else if (quantityChange < -1) {
      quantityChange = -1;
    }

    try {
      await dispatch(modifyServerSideStock(product, quantityChange)).unwrap();
      dispatch(
        changeProductQuantity({
          product,
          quantityChange: quantityChange,
        }),
      );
    } catch (error) {
      console.error('Failed to adjust stock on server: ', error);
    }
  };

  const handleToggleCart = () => {
    dispatch(toggleCartVisibility());
  };

  return (
    <Drawer
      anchor="right"
      open={cartState.cartVisible}
      onClose={handleToggleCart}
      PaperProps={{
        sx: {
          width: '15%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <div>
        {cartState.products &&
          cartState.products.map((item, index) => (
            <CardElement key={item.key || index} sx={{ margin: '0.5rem' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">
                  {item.name} x {item.quantity}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveItem(item)}
                  >
                    Remove
                  </Button>
                  <Box>
                    <Button
                      variant="contained"
                      value={1}
                      onClick={(event) => handleModifyItemInCart(event, item)}
                    >
                      +
                    </Button>
                    <Button
                      variant="contained"
                      value={-1}
                      onClick={(event) => handleModifyItemInCart(event, item)}
                    >
                      -
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </CardElement>
          ))}
      </div>

      <Button
        variant="contained"
        onClick={() => {
          console.log(
            'https://imgflip.com/s/meme/Shut-Up-And-Take-My-Money-Fry.jpg',
          );
        }}
        style={{ padding: '0' }}
      >
        <Link
          to="/cart"
          style={{ width: '100%', padding: '0.5rem' }}
          state={{ cart: cartState }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography align="center" variant="button">
              Checkout
            </Typography>
            <Typography align="center" variant="caption">
              SubTotal: $
              {cartState.totalAmount
                ? cartState.totalAmount.toFixed(2)
                : '0.00'}
            </Typography>
          </Box>
        </Link>
      </Button>
    </Drawer>
  );
}

export default ShoppingCart;
