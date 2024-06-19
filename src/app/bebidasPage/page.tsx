"use client";
import { useRouter } from 'next/navigation';
import Header from "../principal/Header";
import PiePagina from "../principal/piePagina";
import ListaLocales from "../elementos/ListaLocales";

const Page = () => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    localStorage.setItem('selectedRestaurantId', id);
    router.push('/paginaRestaurante');
  };

  return ( 
    <div className="overflow-hidden">
      <Header />
      <h1 className="font-bold text-2xl mt-6 ml-6 mb-4">Bebidas</h1>
      <ListaLocales etiqueta="bar" onCardClick={handleCardClick} />
      <PiePagina />
    </div>
  );
};

export default Page;