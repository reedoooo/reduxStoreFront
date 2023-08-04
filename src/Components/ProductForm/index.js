import React, { useState } from 'react';
import { addProductToDatabase } from '../../store/products';

function AddProductForm() {
  const [newProduct, setNewProduct] = useState({
    _id: '',
    category: '',
    name: '',
    price: '',
    inStock: ''
  });

  const handleChange = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProductToDatabase(newProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="_id" onChange={handleChange} placeholder="ID" />
      <input name="category" onChange={handleChange} placeholder="Category" />
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="price" onChange={handleChange} placeholder="Price" />
      <input name="inStock" onChange={handleChange} placeholder="Stock" />
      <button type="submit">Add product</button>
    </form>
  );
}

export default AddProductForm;
