import React from 'react';
import CreateProductForm from '../components/CreateProductForm';

const CreateProductPage = () => {
  const handleProductCreated = (newProduct) => {
    console.log('New product created:', newProduct);
    // You can update the product list or redirect the user
  };

  return (
    <div>
      <h1>Create a New Product</h1>
      <CreateProductForm onProductCreated={handleProductCreated} />
    </div>
  );
};

export default CreateProductPage;