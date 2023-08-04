import React from 'react';
import {
  Typography,
  styled,
  AppBar,
  Box,
  Toolbar,
  Button
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCartVisibility } from '../../store/cart'; // Updated import

const CustomAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.dark
}));

function Header() {
  const cartState = useSelector((storefrontState) => storefrontState.cart);
  const dispatch = useDispatch();

  const toggleCart = () => {
    dispatch(toggleCartVisibility()); // Updated function call
  };

  return (
    <Box component="header" id="storeHeader" sx={{ flexGrow: 1 }}>
      <CustomAppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, color: '#ffffff' }}
          >
            General Marketplace
          </Typography>
          <Button color="inherit" onClick={toggleCart}>
            {`Basket (${
              cartState.items
                ? cartState.items.reduce(
                    (acc, current) => acc + current.quantity,
                    0
                  )
                : 0
            })`}
          </Button>
        </Toolbar>
      </CustomAppBar>
    </Box>
  );
}

export default Header;
