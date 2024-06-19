"use client";
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cargarRestaurantes } from '../utiles/consultores/restaurantes';
import { cargarAvistamientos } from '../utiles/consultores/avistamientos';
import ImgConstructor from '../utiles/multimedia/ImgConstructor';
import { useRouter } from 'next/navigation';  
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import Carrusel from '../carrusel';
import PiePagina from './piePagina';
import DashboardCercanos from '../elementos/dashboardCercanos';

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

    const [restaurantes, setRestaurantes] = useState<any[]>([]);
    const [avistamientos, setAvistamientos] = useState<any[]>([]);
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState<any>(null);
    const [showDetail, setShowDetail] = useState(false);
    const router = useRouter();

    const handleCardClick = (id: string) => {
        localStorage.setItem('selectedRestaurantId', id);
        if (typeof window !== 'undefined') {
          router.push('/paginaRestaurante'); // Redirige usando next/router
        }
    };

    useEffect(() => {
        // Cargar todos los restaurantes
        cargarRestaurantes()
          .then(data => {
            setRestaurantes(data);
          })
          .catch(error => {
            console.error('Error al cargar todos los restaurantes:', error);
          });

        cargarAvistamientos()
          .then(data => {
            setAvistamientos(data);
          })
          .catch(error => {
            console.error('Error al cargar avistamientos en el map Panel', error);
          });
    }, [userLocationLat, userLocationLng]);

    const handleMapClick = () => {
        setShowDetail(false);
    };

    const handleMarkerClick = (restaurante: any) => {
        setRestauranteSeleccionado(restaurante);
        setShowDetail(true);
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
                <div onClick={handleMapClick}>
                  <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
                    <MapContainer center={[userLocationLat ?? 0, userLocationLng ?? 0]} zoom={16} minZoom={10} maxZoom={20}
                      maxBounds={[[-90, -180], [90, 180]]}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Circle center={[userLocationLat ?? 0, userLocationLng ?? 0]} radius={700} />
                      <Marker position={[userLocationLat ?? 0, userLocationLng ?? 0]} icon={L.icon({
                        iconUrl: 'ubActual.png',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16],
                        popupAnchor: [0, -16],
                      })} />

                      {/* Marcadores de restaurantes */}
                      {restaurantes.map((restaurante) => (
                        <Marker
                          key={restaurante.id_restaurante}
                          position={[restaurante.coordenada_latitud, restaurante.coordenada_longitud]}
                          icon={L.icon({
                            iconUrl: restaurante.icono_base + ".png",
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16],
                          })}
                          eventHandlers={{
                            click: (e) => {
                              e.originalEvent.stopPropagation();
                              handleMarkerClick(restaurante);
                            },
                          }}
                        >
                          <Popup>
                            <h3>{restaurante.nombre_restaurante}</h3>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>

                    {showDetail && restauranteSeleccionado && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          padding: '1em',
                          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                          zIndex: 1000,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href="paginaRestaurante" key={restauranteSeleccionado.id_restaurante} 
                          onClick={() => handleCardClick(restauranteSeleccionado.id_restaurante)} // Attach click event handler
                          className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 sm:items-start sm:place-items-start" style={{ textDecoration: 'none', margin: '1%', width: '48%', maxWidth: '48%' }}>
                            {restauranteSeleccionado.imagen && (
                              <ImgConstructor
                                imgBytea={restauranteSeleccionado.imagen}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                className="rounded-t-lg h-80 sm:h-auto sm:w-48 sm:rounded-none sm:rounded-l-lg max-w-full"
                              />
                            )}
                            <div className="flex flex-col p-4 leading-normal text-left sm:text-left mr-12" style={{ width: '48%' }}>
                              <h5 className="mb-2 lg:text-xl font-bold tracking-tight text-gray-900 dark:text-white text-sm">{restauranteSeleccionado.nombre_restaurante}</h5>
                              <p className="mt-1 font-normal text-xs lg:text-sm text-gray-700 text-left">Hora de entrada: {restauranteSeleccionado.horario_atencion}</p>
                              <p className="mt-1 mb-1 font-normal text-xs sm:text-sm text-gray-700 flex items-center text-left">Calificación: {restauranteSeleccionado.valoracion} <StarIcon /></p>
                            </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
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
