import React, { useEffect, useState } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data); // Directly use the array returned from FastAPI
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <h1>Product List</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;