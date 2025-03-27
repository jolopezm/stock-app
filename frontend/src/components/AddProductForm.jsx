import React, { useState } from 'react';
import brands from '../data/brands.json';
import sizes from '../data/sizes.json';
import Toast from './Toast';

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
  const [showToast, setShowToast] = useState(false)

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

    const quantityNumber = parseInt(quantity, 10);
    const normalPriceNumber = parseFloat(normal_price);
    const sizeNumber = parseFloat(size);

    if (!name.trim()) {
      setError('El nombre es necesario');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (isNaN(quantityNumber)) {
      setError('Por fevor ingrese una cantidad valida');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (isNaN(normalPriceNumber)) {
      setError('Por favor ingrese un precio valido');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (isNaN(sizeNumber)) {
      setError('Por favor ingrese una talla valida');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    if (quantityNumber < 0 || normalPriceNumber < 0 || sizeNumber < 0) {
      setError('Valores no pueden ser negativos');
      setShowToast(true);
      setIsSubmitting(false);
      return;
    }

    const productData = {
      name: name.trim(),
      quantity: quantityNumber,
      normal_price: normalPriceNumber,
      category: category || null, 
      brand: brand || null,
      gender: gender,
      size: sizeNumber, 
    };

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
      setBrand("");
      setSize('');
      setError('');
    } catch (error) {
      console.error('Error añadiendo producto:', error); 
      console.log(productData)
      setError(error.message || 'Error añadiendo producto. Por favor, intente de nuevo.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=''>
      <div className="columns">
        <div className='column col-12'>
          {error && showToast && (
            <Toast type="toast-error" message={error} onClose={() => setShowToast(false)} />
          )}
        </div>
          
        <div className="column col-lg-6 col-sm-12">
          <label className="form-label">Nombre:</label>
          <input
            className='form-input'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre del producto"
            disabled={isSubmitting}
          />

          <label className="form-label">Marca:</label>
          <select
            className='form-select'
            value={brand}
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

          <div className='columns'>
          <div className='column col-6 col-sm-12'>
            <label className="form-label">Género:</label>
            <div className="form-group" onChange={(e) => handleGenderChange(e.target.value)}>
              <label className="form-radio form-inline">
                <input type="radio" name="gender" value="male"/><i className="form-icon"></i> Hombre
              </label>
              <label className="form-radio form-inline">
                <input type="radio" name="gender" value="female"/><i className="form-icon"></i> Mujer
              </label>
            </div>
          </div>

          <div className='column col-6 col-sm-12'>
            <label className="form-label">Talla:</label>
            <select
              className='form-select'
              value={size}
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

          <label className="form-label">Categoría:</label>
          <select
            className='form-select'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Seleccione la categoría del producto"
            disabled={isSubmitting}
          >
            <option value="">Seleccione una categoria</option>
            <option value="Running">Running</option>
            <option value="Urbano">Urbano</option>
          </select>

          <label className="form-label">Cantidad:</label>
          <input
            className='form-input'
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            placeholder="0"
            disabled={isSubmitting}
          />
        </div>

        <div className="column col-lg-6 col-sm-12">
          <label className="form-label">Precio ($):</label>
          <input
            className='form-input'
            type="number"
            step="0.01"
            value={normal_price}
            onChange={(e) => setNormalPrice(e.target.value)}
            min="0"
            placeholder="0.00"
            disabled={isSubmitting}
          />

          <label className="form-label">Precio oferta:</label>
          <input
            className='form-input'
            type="number"
            step="0.01"
            value={normal_price}
            onChange={(e) => setNormalPrice(e.target.value)}
            min="0"
            placeholder="0.00"
            disabled={isSubmitting}
          />

          <div className="form-group">
            <label className="form-checkbox">
              <input type="checkbox" />
              <i className="form-icon"></i> Igual al precio original
            </label>
          </div>

          <label className="form-label">Imagen:</label>
          <input className="form-input" type='file'></input>

        </div>

        <div className='column col-12 text-right'>
          <br/>
          <button
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-primary col-2"
          >
            {isSubmitting ? 'Añadiendo...' : 'Añadir'}
          </button> 
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
