import React, { useEffect, useState } from "react";
import ImgConstructor from "../utiles/multimedia/ImgConstructor";
import { cargarCercanos } from '../utiles/consultores/restaurantes';


interface MapPanelProps {
    centro: [number, number];
}

const StarIcon = () => (
    <span className="ml-1 sm:ml-2">
        <svg className="h-4 w-4 sm:h-6 sm:w-6" viewBox="0 0 47.94 47.94" fill="#ede607">
            <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/>
        </svg>
    </span>
);

const handleCardClick = (id: string) => {
    localStorage.setItem('selectedRestaurantId', id);
    window.location.href = 'paginaRestaurante';  // Redirige a la nueva página
  };

const DashboardCercanos = ({ centro }: MapPanelProps) => {
    const [restaurantesC, setRestaurantesC] = useState<any[]>([]);

    useEffect(() => {
        const [latitud, longitud] = centro;

        cargarCercanos(latitud, longitud)
            .then(data => {
                setRestaurantesC(data);
            })
            .catch(error => {
                console.error('Error al cargar los restaurantes cercanos en el dashboard de cercanos:', error);
            });

    }, [centro]);

    return ( 
        <div className="mt-1 mx-1 bg-white" style={{ height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {restaurantesC.slice(0, 8).map((restaurante) => (
                <a href="paginaRestaurante" key={restaurante.id_restaurante} 
                onClick={() => handleCardClick(restaurante.id_restaurante)}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 sm:items-start sm:place-items-start" style={{ textDecoration: 'none', margin: '1%', width: '48%', maxWidth: '48%' }}>
                    {restaurante.imagen && (
                        <ImgConstructor
                            imgBytea={restaurante.imagen}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            className="rounded-t-lg h-80 sm:h-auto sm:w-48 sm:rounded-none sm:rounded-l-lg max-w-full"
                        />
                    )}
                    <div className="flex flex-col p-4 leading-normal text-left sm:text-left mr-12" style={{ width: '48%' }}>
                        <h5 className="mb-2 lg:text-xl font-bold tracking-tight text-gray-900">{restaurante.nombre_restaurante}</h5>
                        <p className="mt-1 font-normal text-xs lg:text-sm text-gray-700 text-left">Hora de entrada: {restaurante.horario_atencion}</p>
                        <p className="mt-1 mb-1 font-normal text-xs sm:text-sm text-gray-700 flex items-center text-left">Calificación: {restaurante.valoracion} <StarIcon /></p>
                    </div>
                </a>

            ))}
        </div>
    );
};

export default DashboardCercanos;