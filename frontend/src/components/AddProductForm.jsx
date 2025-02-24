import React, { useState } from 'react';
import brands from '../data/brands.json';
import sizes from '../data/sizes.json';

const AddProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [normal_price, setNormalPrice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gender, setGender] = useState('');
  
  const menSizes = sizes.menSizes;
  const womenSizes = sizes.womenSizes;

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setSize('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate inputs
    const quantityNumber = parseInt(quantity, 10);
    const normalPriceNumber = parseFloat(normal_price);
    const sizeNumber = parseFloat(size); // Convert size to a number

    if (!name.trim()) {
      setError('El nombre es necesario');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(quantityNumber)) {
      setError('Por fevor ingrese una cantidad valida');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(normalPriceNumber)) {
      setError('Por favor ingrese un precio valido');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(sizeNumber)) {
      setError('Por favor ingrese una talla valida');
      setIsSubmitting(false);
      return;
    }

    if (quantityNumber < 0 || normalPriceNumber < 0 || sizeNumber < 0) {
      setError('Valores no pueden ser negativos');
      setIsSubmitting(false);
      return;
    }

    const productData = {
      name: name.trim(),
      quantity: quantityNumber,
      normal_price: normalPriceNumber,
      category: category || null, 
      brand: brand || null, 
      size: sizeNumber, 
    };

    console.log('Sending product data:', productData); // Log data before sending

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error data:', errorData); 
        throw new Error(errorData.detail || `Error añadiendo producto: ${response.statusText}`);
      }

      const newProduct = await response.json();
      onProductAdded(newProduct);

      setName('');
      setQuantity('');
      setNormalPrice('');
      setCategory('');
      setBrand('');
      setSize('');
      setError('');
    } catch (error) {
      console.error('Error añadiendo producto:', error); 
      setError(error.message || 'Error añadiendo producto. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='container'>
      <div className='row'>
        {error && <div className='error'>{error}</div>}
      </div>

      <div className='row'>
        <div className='six columns'>
        <div>
          <label htmlFor="productName">Nombre:</label>
          <input
            id="productName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre del producto"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="brand">Marca:</label>
          <select
            id="brand"
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Seleccione la marca del producto"
            disabled={isSubmitting}
          >
            <option value="">Seleccione una marca</option>
            {brands.map(option => (
              <option key={option.id} value={option.value}>
                {option.value}
              </option>
            ))}
          </select> 
        </div>

        <div className='row'>
          <div className='six columns'>
            <label htmlFor="gender">Género:</label>
            <select
              id="gender"
              name="gender"
              onChange={(e) => handleGenderChange(e.target.value)}
              >
                <option>Seleccione el género</option>
                <option value={'male'}>Masculino</option>
                <option value={'female'}>Femenino</option>
            </select>
          </div>
        

          <div className='six columns'>
            <label htmlFor="size">Talla:</label>
            <select
              id="size"
              onChange={(e) => setSize(e.target.value)}
              placeholder="Seleccione la talla del producto"
              disabled={!gender || isSubmitting}
            >
              <option value="">Seleccione una talla</option>
              {(gender === 'male' ? menSizes : gender === 'female' ? womenSizes : []).map(option => (
                <option key={option.id} value={option.us}>
                  {option.us}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="category">Categoría:</label>
          <select
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Seleccione la categoría del producto"
            disabled={isSubmitting}
          >
            <option value="">Seleccione una categoria</option>
            <option value="Running">Running</option>
            <option value="Urbano">Urbano</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity">Cantidad:</label>
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

      </div>

      <div className='six columns'>
        <div>
          <label htmlFor="normal_price">Precio ($):</label>
          <input
            id="normal_price"
            type="number"
            step="0.01"
            value={normal_price}
            onChange={(e) => setNormalPrice(e.target.value)}
            min="0"
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="normal_price">Precio oferta:</label>
          <input
            id="normal_price"
            type="number"
            step="0.01"
            value={normal_price}
            onChange={(e) => setNormalPrice(e.target.value)}
            min="0"
            placeholder="0.00"
            disabled={isSubmitting}
          />

          
          <input type="checkbox" />
          <span>Igual al precio original</span>
          
        </div>

        <div>
          <label>Imagen:</label>
          <input type='file'></input>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="button-primary"
        >
          {isSubmitting ? 'Añadiendo...' : 'Añadir'}
        </button>
      </div>
      </div>

    </form>
  );
};

export default AddProductForm;
