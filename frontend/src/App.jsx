import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddProductPage from './pages/AddProductPage';

function App() {
  const [products, setProducts] = useState([]);

  return (
    <div className='container'>
      <header>
        <h1>Stock App</h1>
      </header>
      <Router>
        <ul className="breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-product">Añade producto</Link></li>
        </ul>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-product" element={<AddProductPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;