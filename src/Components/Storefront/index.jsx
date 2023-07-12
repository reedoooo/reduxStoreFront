import React from 'react';
import Categories from '../Categories';
import Products from '../Products';
import SimpleCart from '../SimpleCart';

function Storefront() {
  return (
    <>
      <Categories />
      <Products />
      <SimpleCart />
    </>
  );
}

export default Storefront;
