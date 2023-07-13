import React from 'react';
import { useLocation } from 'react-router';
import {
  Card as CardElement,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSelector } from 'react-redux';

// Create a new subcomponent to reduce code repetition for TextFields
function CustomTextField({ id = 'outlined', label, type }) {
  return <TextField id={id} label={label} type={type} />;
}

function ShoppingCart() {
  let { state } = useLocation();
  const isCartVisible = useSelector((storefrontState) => storefrontState.cart.cartVisible);

  if (!isCartVisible) {
    return null;
  }

  const totalAmount = state.cart.items.reduce(
    (acc, current) => acc + current.price * current.quantity,
    0
  );

  return (
    <CardElement>
      <CardContent>
        {state.cart.items.map((item) => (
          <Box key={`${item.name}_box`}>
            <CardElement sx={{ margin: '0.5rem' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">{`$${item.price}`}</Typography>
              </CardContent>
            </CardElement>
          </Box>
        ))}
        <Box>
          <CardElement sx={{ margin: '0.5rem' }}>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{`$${totalAmount}`}</Typography>
            </CardContent>
          </CardElement>
        </Box>
        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
            Customer Info
          </Typography>
          <form>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <CustomTextField label="First Name" />
                  <CustomTextField label="Last Name" />
                </Box>
                <CustomTextField label="Street Address" />
                <CustomTextField label="City" />
                <CustomTextField label="State" />
                <CustomTextField type="number" label="Zip" />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CustomTextField type="number" label="Card Number" />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker />
                  </LocalizationProvider>
                  <CustomTextField type="number" label="CVV" />
                </Box>
                <Box sx={{ alignSelf: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      event.preventDefault();
                      alert('Thank you for your purchase!');
                    }}
                  >
                    Submit Order
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      </CardContent>
    </CardElement>
  );
}

export default ShoppingCart;

// import React from "react";
// import { useLocation } from "react-router";
// import { Card, CardContent, CardHeader, Typography, Box, Button, TextField } from "@mui/material";

// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// function ShoppingCart() {

//   let { state } = useLocation();

//   return(
//     <Card>
//       <CardHeader title={'Order Summary'} />
//       <CardContent>
//         {state.cart.items.map(item => (
//           <Box>
//             <Card sx={{margin: '0.5rem'}}>
//               <CardContent sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//                 <Typography variant='body1'>{item.name}</Typography>
//                 <Typography variant='body1'>{`$${item.price}`}</Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         ))}
//         <Box>
//           <Card sx={{margin: '0.5rem'}}>
//             <CardContent sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//               <Typography variant="h6" >Total</Typography>
//               <Typography variant="h6">{`$${state.cart.items.reduce((acc, current) => {return acc + (current.price * current.quantity)}, 0)}`}</Typography>
//             </CardContent>
//           </Card>
//         </Box>
//         <Box sx={{marginTop: '2rem'}}>
//           <Typography variant="h5" sx={{marginBottom: '1rem'}}>Customer Info</Typography>
//             <form>
//               <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
//                 <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} >
//                   <div>
//                   <TextField
//                     id="outlined"
//                     label='First Name'
//                   />
//                   <TextField
//                     id="outlined"
//                     label='Last Name'
//                   />
//                   </div>
//                   <TextField
//                     id="outlined"
//                     label='Street Address'
//                   />
//                   <TextField
//                     id="outlined"
//                     label='City'
//                   />
//                   <TextField
//                     id="outlined"

//                     label='State'
//                   />
//                   <TextField
//                     id="outlined"
//                     type="number"
//                     label='Zip'
//                   />
//                 </Box>
//                 <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
//                   <Box sx={{display: 'flex', flexDirection: 'column'}}>
//                     <TextField
//                       id="outlined"
//                       type="number"
//                       label='Card Number'
//                     />
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                       <DatePicker />
//                     </LocalizationProvider>
//                     <TextField
//                       id="outlined"
//                       type="number"
//                       label='CVV'
//                     />
//                   </Box>

//                   <Box sx={{alignSelf: 'center'}}>
//                     <Button
//                       variant="contained"
//                       // type="submit"
//                       onClick={(event) => {
//                         event.preventDefault();
//                         alert('Thank you for your purchase!');
//                       }}
//                     >
//                       Submit Order
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>
//             </form>
//         </Box>
//       </CardContent>

//     </Card>

//   )

// }

// export default ShoppingCart;
