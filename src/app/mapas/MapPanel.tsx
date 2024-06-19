import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cargarRestaurantes } from '../utiles/consultores/restaurantes';
import { cargarAvistamientos } from '../utiles/consultores/avistamientos';
import ImgConstructor from '../utiles/multimedia/ImgConstructor';
import { useRouter } from 'next/navigation';  

interface MapPanelProps {
  centro: [number, number];
}

const MapPanel: React.FC<MapPanelProps> = ({ centro }: MapPanelProps) => {
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
    // Asegurarse de que solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
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
    }
  }, [centro]);

  const handleMapClick = () => {
    setShowDetail(false);
  };

  const handleMarkerClick = (restaurante: any) => {
    setRestauranteSeleccionado(restaurante);
    setShowDetail(true);
  };

  // Asegurarse de que solo se renderiza en el cliente
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div onClick={handleMapClick}>
      <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
        <MapContainer center={centro} zoom={16} minZoom={10} maxZoom={20}
          maxBounds={[[-90, -180], [90, 180]]}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Circle center={centro} radius={700} />
          <Marker position={centro} icon={L.icon({
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
                </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
