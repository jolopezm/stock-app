import React, { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCheckboxChange = (event, productSKU) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedProducts(prevState => [...prevState, productSKU]);
    } else {
      setSelectedProducts(prevState => prevState.filter(sku => sku !== productSKU));
    }
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allProductSKUs = products.map(product => product.sku);
      setSelectedProducts(allProductSKUs);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const productSKU of selectedProducts) {
        await fetch(`/api/products/${productSKU}`, { method: 'DELETE' });
      }
      // Refetch products after deletion
      fetchProducts();
      setSelectedProducts([]);
      setSelectAll(false);
    } catch (error) {
      setError('Error deleting products');
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error loading products</h1>
        <p>{error}</p>
        <button onClick={fetchProducts}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <h4>Lista de productos</h4>   
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-container">
          <table className='u-full-width'>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>SKU</th>
                <th>Marca</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Talla</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Fecha de entrada</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product.sku)}
                      onChange={(event) => handleCheckboxChange(event, product.sku)}
                    />
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.brand}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.size}</td>
                  <td>{product.quantity}</td>
                  <td>${product.normal_price.toFixed(2)}</td>
                  <td>{product.entry_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className=''>
        <div className="row">
          <div className="seven columns">
            <p>Filas: {products.length}</p>
          </div>
          <div className="five columns" style={{ textAlign: 'right' }}>
            <div className="six columns" style={{ textAlign: 'right' }}>
              <button 
                className="button-primary u-full-width" 
                disabled={selectedProducts.length > 1}
              >
                actualizar
              </button>
            </div>
            <div className="six columns" style={{ textAlign: 'right' }}>
              <button 
                className="button-eliminar u-full-width" 
                onClick={handleDeleteSelected}
              >
                eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;