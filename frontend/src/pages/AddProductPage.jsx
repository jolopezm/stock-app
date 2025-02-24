import React from 'react';
import AddProductForm from '../components/AddProductForm';

const AddProductPage = () => {
  const handleProductAdded = (newProduct) => {
    console.log('New product Added:', newProduct);
    // You can update the product list or redirect the user
  };

  return (
    <div>
      <h4>Añadir nuevo producto</h4>
      <AddProductForm onProductAdded={handleProductAdded} />
    </div>
  );
};

export default AddProductPage;