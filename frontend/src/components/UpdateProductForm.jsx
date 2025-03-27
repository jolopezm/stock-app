import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import brands from '../data/brands.json';
import sizes from '../data/sizes.json';

const UpdateProductForm = () => {
  const { sku } = useParams();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(null);
  const [name, setName] = useState(null);
  const [brand, setBrand] = useState(null);
  const [category, setCategory] = useState(null);
  const [size, setSize] = useState(null);
  const [normal_price, setNormalPrice] = useState(null);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);


  const menSizes = sizes.menSizes;
  const womenSizes = sizes.womenSizes;

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setSize('');
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${sku}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch product: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [sku]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/products/${sku}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
      }
      alert('Producto actualizado con éxito');
      fetchProduct(); // Refresh data after update
    } catch (error) {
      setError(error.message);
      console.error('Update error:', error);
    }
  };

  const handleChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading product...</div>;
  if (error) {
    return (
      <div>
        <h1>Error loading product</h1>
        <p>{error}</p>
        <button onClick={fetchProduct}>Try again</button>
      </div>
    );
  }

  if (!product) return <p>Producto no encontrado.</p>;

  return (
    <form onSubmit={handleSubmit} className=''>
      <p>SKU: {sku}</p>
      <div className="columns">
        <div className='column col-12'>
          {error && <div className="label label-error">{error}</div>}
        </div>

        <div className="column col-lg-6 col-sm-12">
          <label className="form-label">Nombre:</label>
          <input
            className='form-input'
            type="text"
            value={product.name}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ingrese el nombre del producto"
            disabled={isSubmitting}
          />

          <label className="form-label">Marca:</label>
          <select
            className='form-select'
            value={product.brand}
            onChange={(e) => setProduct.brand(e.target.value)}
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
              value={product.size}
              onChange={(e) => setProduct.size(e.target.value)}
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
            value={product.category}
            onChange={(e) => setProduct.category(e.target.value)}
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
            value={product.quantity}
            onChange={(e) => setProduct.quantity(e.target.value)}
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
            value={product.normal_price}
            onChange={(e) => setProduct.normal_price(e.target.value)}
            min="0"
            placeholder="0.00"
            disabled={isSubmitting}
          />

          <label className="form-label">Precio oferta:</label>
          <input
            className='form-input'
            type="number"
            step="0.01"
            value={product.normal_price}
            onChange={(e) => setProduct.normal_price(e.target.value)}
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

export default UpdateProductForm;