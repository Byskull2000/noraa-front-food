"use client";
import { useRouter } from 'next/navigation';
import ListaLocales from "../elementos/ListaLocales";
import Header from "../principal/Header";
import PiePagina from "../principal/piePagina";

const Page = () => {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    localStorage.setItem('selectedRestaurantId', id);
    router.push('/paginaRestaurante');
  };
  return ( 
    <div className="overflow-hidden">
      <Header />
      <h1 className="font-bold text-2xl mt-6 ml-6 mb-4">Restaurantes</h1>
      <ListaLocales etiqueta="restaurante" onCardClick={handleCardClick} />
      <PiePagina />
    </div>
  );
};

export default Page;