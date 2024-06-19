"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';  
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import Carrusel from '../carrusel';
import PiePagina from './piePagina';
import DashboardCercanos from '../elementos/dashboardCercanos';

// Cargar MapPanel dinámicamente sólo en el cliente
const DynamicMapPanel = dynamic(() => import('../mapas/MapPanel'), { ssr: false });

const StarIcon = () => (
  <span className="ml-1 sm:ml-2">
    <svg className="h-4 w-4 sm:h-6 sm:w-6" viewBox="0 0 47.94 47.94" fill="#ede607">
      <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/>
    </svg>
  </span>
);

const Body = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const userLocationLat = useUserLocation()?.lat;
    const userLocationLng = useUserLocation()?.lng;
    const { direccion } = useGeocoder({ lat: userLocationLat ? userLocationLat : 0, lng: userLocationLng ? userLocationLng : 0 });

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const router = useRouter();

    return (
        <>
            <div className="block text-center lg:float-right lg:mr-4 bg-white">
                <button 
                    className="mt-6 w-64 sm:w-80 lg:w-auto lg:h-12 h-12 flex items-center justify-center space-x-2 bg-orange-400 text-white px-4 py-2 rounded-full mx-auto hover:bg-orange-500"
                    onClick={openModal}
                >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-sm lg:text-md">{direccion}</span>
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Mapa Modal"
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        background: 'transparent',
                        border: 'none',
                        padding: '0',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center', alignItems: 'center'
                    },
                }}
            >
                <button 
                    className="mb-3 mr-4 accept-button mt-0 tracking-wide font-semibold bg-orange-400 text-white py-3 px-5 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none" 
                    style={{ position: 'absolute', bottom: '20px', right: '10px', zIndex: '1100' }} 
                    onClick={closeModal}
                >
                    Volver
                </button>
                <DynamicMapPanel centro={[userLocationLat ?? 0, userLocationLng ?? 0]} />
            </Modal>

            <div className="lg:w-full">
                {!modalIsOpen && (
                    <>
                        <div className="lg:w-full">
                            <h1 className="lg:font-bold lg:ml-8 lg:mt-11 xl:text-2xl font-bold mt-5 ml-3 text-lg">¿Qué buscas hoy?</h1> 
                            <h1 className="lg:ml-10"> <Carrusel></Carrusel></h1>
                            <a href="./todosPage">
                                <img src="negocios4.jpg" className="mt-5 mx-auto rounded-xl w-11/12 lg:h-48 transition-transform duration-300 hover:scale-105 h-20" alt="Todos Negocios"/>
                            </a>
                        </div>
                        <h1 className="lg:font-bold lg:ml-8 lg:mt-11 xl:text-2xl font-bold mt-5 ml-3 text-lg">Negocios cercanos a ti</h1> 
                        <DashboardCercanos centro={[(userLocationLng != null) ? userLocationLng : 0.0, (userLocationLat != null) ? userLocationLat : 0.0]} /> 
                        <PiePagina />
                    </>
                )}
            </div>
        </>
    );
}

export default Body;
