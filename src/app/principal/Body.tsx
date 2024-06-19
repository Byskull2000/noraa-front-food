"use client";
import React, { useState } from 'react';
import Modal from 'react-modal';
import MapPanel from '../mapas/MapPanel';
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import Geocoder from '../utiles/geolocalizadores/Geocoder';
import Carrusel from '../carrusel';
import PiePagina from './piePagina';
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import DashboardCercanos from '../elementos/dashboardCercanos';

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

    return (
        <>
            <div className="block text-center lg:float-right lg:mr-4">
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
