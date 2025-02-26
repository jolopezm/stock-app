import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddProductPage from './pages/AddProductPage';
import UpdateProduct from './pages/UpdateProduct';

function App() {
  const [products, setProducts] = useState([]);

  return (
    <div className='container'>
      <header className="navbar">
        <section className="navbar-section">
          <a href="..." className="navbar-brand mr-2"><h3>Stock App</h3></a>
          <a href="..." className="btn btn-link">Docs</a>
        </section>
        <section className="navbar-section">
          <figure className="avatar avatar-md" data-initial="YZ" style={{backgroundColor: 'blueviolet'}}></figure>
        </section>
      </header>
      <Router>

        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/add-product">Añade producto</Link>
          </li>
        </ul>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path='/update-product/:sku' element={<UpdateProduct />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;