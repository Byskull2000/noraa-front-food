import { useState, useEffect } from 'react';
import axios from 'axios'; 

interface Coordenadas {
  direccion: string;
}

const useGeocoder = (coordenadas: { lat: number; lng: number }): Coordenadas => {
  const [direccion, setDireccion] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && coordenadas.lat && coordenadas.lng) {
      const obtenerDireccion = async () => {
        setDireccion("-");
        try {
          const response = await axios.get(`https://api.maptiler.com/geocoding/${coordenadas.lng},${coordenadas.lat}.json?key=N8TAFyC3Qqolu9pUnZdo`);
          const features = response.data.features;
          if (features.length > 0) {
            const direccionFormateada = features[0].place_name;
            setDireccion(direccionFormateada);
          } else {
            setDireccion("Dirección no encontrada");
          }
        } catch (error) {
          console.error('Error al obtener la dirección:', error);
          setDireccion("Error al obtener la dirección");
        }
      };

      obtenerDireccion();
    }
  }, [coordenadas]);

  return { direccion };
};

export default useGeocoder;
