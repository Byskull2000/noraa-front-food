"use client";
import React from 'react';
import ListaLocales from "../elementos/ListaLocales";
import Header from "../principal/Header";
import PiePagina from "../principal/piePagina";
import { useRouter } from 'next/navigation';  // Importa desde 'next/navigation'

const Page = () => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    localStorage.setItem('selectedRestaurantId', id);
    router.push('/paginaRestaurante');
  };

  return ( 
    <div className="overflow-hidden">
      <Header />
      <h1 className="font-bold text-2xl mt-6 ml-6 mb-4">Todos los negocios</h1>
      <ListaLocales etiqueta="" onCardClick={handleCardClick} />
      <PiePagina />
    </div>
  );
};

export default Page;