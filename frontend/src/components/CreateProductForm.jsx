import React, { useState } from 'react';

const CreateProductForm = ({ onProductCreated }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate inputs
    const quantityNumber = parseInt(quantity, 10);
    const priceNumber = parseFloat(price);
    
    if (!name.trim()) {
      setError('Product name is required');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(quantityNumber)) {
      setError('Please enter a valid quantity');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(priceNumber)) {
      setError('Please enter a valid price');
      setIsSubmitting(false);
      return;
    }

    if (quantityNumber < 0 || priceNumber < 0) {
      setError('Values cannot be negative');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          quantity: quantityNumber,
          price: priceNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to create product: ${response.statusText}`);
      }

      const newProduct = await response.json();
      onProductCreated(newProduct);
      
      // Reset form
      setName('');
      setQuantity('');
      setPrice('');
      setError('');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Create New Product</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="productName">Product Name:</label>
        <input
          id="productName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price ($):</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          placeholder="0.00"
          disabled={isSubmitting}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

export default CreateProductForm;