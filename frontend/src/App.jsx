import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateProductPage from './pages/CreateProductPage';

function App() {
  const [products, setProducts] = useState([]);

  return (
    <div>
      <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/create-product">Create Product</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-product" element={<CreateProductPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;