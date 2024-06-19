import React from 'react';
import Header from './Header';
import Body from './Body';
import Carrusel from '../carrusel'
import PiePagina from './piePagina' 

const Page = () => {
  return (
    
    <div className="overflow-hidden">
      
      <Header />
      <Body />
      <PiePagina />
    </div>
  );
};

export default Page;
