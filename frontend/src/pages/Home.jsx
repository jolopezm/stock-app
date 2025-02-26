import React, { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';

const Home = () => {
  return (
    <div>
      <div className='columns'>
        <h4 className='column col-6'>Lista de productos</h4>
        <div className="column col-6 text-right">
          <button className="btn col-3 col-sm-12">filtros</button>
        </div>
      </div>

      <ProductTable></ProductTable>
    </div>
  );  
};

export default Home;