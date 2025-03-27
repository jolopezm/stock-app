import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products');
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} - ${text.slice(0, 50)}...`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCheckboxChange = (sku) => (event) => {
    const isChecked = event.target.checked;
    setSelectedProducts((prev) =>
      isChecked ? [...prev, sku] : prev.filter((id) => id !== sku)
    );
  };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedProducts(isChecked ? products.map((p) => p.sku) : []);
  };

  const handleDeleteSelected = async () => {
    try {
        console.log('Deleting SKUs:', selectedProducts);
        await Promise.all(
            selectedProducts.map((sku) => {
                const url = `/api/products/${sku}`; // Changed to /api/
                console.log('DELETE URL:', url);
                return fetch(url, { method: 'DELETE' }).then((response) => {
                    if (!response.ok) {
                        return response.text().then((text) => {
                            throw new Error(`Delete failed for SKU ${sku}: ${response.status} - ${text}`);
                        });
                    }
                    return response.json();
                });
            })
        );
        setSelectedProducts([]);
        setSelectAll(false);
        fetchProducts();
    } catch (error) {
        setError('Error deleting products: ' + error.message);
        console.error('Delete error:', error);
    }
};

  const handleUpdateSelected = () => {
    if (selectedProducts.length === 1) {
      navigate(`/update-product/${selectedProducts[0]}`);
    }
  };

  if (loading) return <div>Loading products...</div>;
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
    <div className="">
      <div className="col-12">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="table-container">
            <table className="col-12">
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
                  <th>Género</th>
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
                        onChange={handleCheckboxChange(product.sku)}
                      />
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.brand}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.gender}</td>
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
      </div>
      <div className="col-12">
        <br />
        <div className="columns">
          <br />
          <div className="column col-6">
            <p>Filas: {products.length}</p>
          </div>
          <div className="column col-6 col-sm-12">
            <div className="columns">
              <div className="column col-6">
                <button
                  className="btn btn-primary col-12"
                  disabled={selectedProducts.length !== 1}
                  onClick={handleUpdateSelected}
                >
                  Actualizar
                </button>
              </div>
              <div className="column col-6">
                <button
                  className="btn btn-primary col-12"
                  onClick={handleDeleteSelected}
                  disabled={selectedProducts.length === 0}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;