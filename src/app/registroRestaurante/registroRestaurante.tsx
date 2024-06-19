"use client";
//import Spline from '@splinetool/react-spline';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import useUserLocation from '../utiles/geolocalizadores/useUserLocation';
import 'leaflet/dist/leaflet.css';
import useGeocoder from '../utiles/geolocalizadores/Geocoder';
import TagPopup from '../elementos/TagPopUp';


const RegistroRestaurante: React.FC = () => {
    const [primerUso, setPrimerUso] = useState(true);
    const userLocationLat = useUserLocation()?.lat;
    const userLocationLng = useUserLocation()?.lng;

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState<string>('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [icono, setIcono] = useState('');
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const [imagen, setImagen] = useState<string>('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [intentoSumbit, setIntentoSumbit] = useState(false);

    const { direccion: direccionGeocoder } = useGeocoder({ lat: latitud, lng: longitud });

    useEffect(() => {
        if (primerUso && userLocationLat !== undefined && userLocationLng !== undefined) {
            setLatitud(userLocationLat);
            setLongitud(userLocationLng);
            setPrimerUso(false);
        }
    }, [userLocationLat, userLocationLng, primerUso]);

    useEffect(() => {
        setDireccion(direccionGeocoder);
    }, [direccionGeocoder]);

    const MapEventHandler = () => {
        const map = useMapEvents({
            moveend: () => {
                const center = map.getCenter();
                const latC = parseFloat(center.lat.toFixed(5));
                const lngC = parseFloat(center.lng.toFixed(5));
                setLatitud(latC);
                setLongitud(lngC);
            },
        });
        return null;
    };

    const [registroExitoso, setRegistroExitoso] = useState(false);

    const playSuccessSound = () => {
        const audio = new Audio('correcto.mp3');
        audio.play();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!nombre || !correo || !telefono || !direccion || !horaEntrada || !horaSalida || !icono || !imagen || !selectedTags.length) {
            setIntentoSumbit(true);
            return;
        }
        try {
            const response = await fetch('https://noraa-backend-6v2teu43ta-tl.a.run.app/restaurantes-registrar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_restaurante: nombre,
                    email: correo,
                    direccion: direccion,
                    telefono: telefono,
                    horario_atencion: `${horaEntrada}-${horaSalida}`,
                    coordenada_longitud: longitud,
                    coordenada_latitud: latitud,
                    valoracion: 0.0,
                    icono_base: icono,
                    imagen: imagen, // Envía la imagen base64 al backend
                    etiquetas: selectedTags
                })
            });
            if (response.ok) {
                console.log('Restaurante registrado exitosamente');
                setRegistroExitoso(true);
                playSuccessSound();
            } else {
                console.error('Error al registrar el restaurante:', response.statusText);
            }
        } catch (error) {
            console.error('Error al registrar el restaurante:', error);
        }
    };


    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [buttonText, setButtonText] = useState<string>("Seleccionar Imagen");
    const [buttonColor, setButtonColor] = useState<string>("bg-orange-400");

    const handleFileUpload = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            setSelectedFile(file);
            reader.onload = (event) => {
                if (event.target) {
                    const fileContent = event.target.result as string; // Contenido del archivo en formato base64
                    setImagen(fileContent); // Almacena la imagen como base64 en lugar de un array de bytes
                    setButtonText("Imagen Seleccionada");
                    setButtonColor("bg-green-400");
                    // Ahora puedes enviar la imagen base64 al backend
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagPopupOpen, setTagPopupOpen] = useState(false);

    const openTagPopup = () => {
        setTagPopupOpen(true);
    };

    const closeTagPopup = () => {
        setTagPopupOpen(false);
    };

    const handleUpdateTags = (tags: string[]) => {
        setSelectedTags(tags);
    };


    return (
        <div className={`min-h-screen ${registroExitoso ? 'bg-green-500' : 'bg-orange-700'} text-gray-900 flex justify-center`}>
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <h1 className="font-bold text-2xl mt-2 flex justify-between items-center">
                            Registra tu negocio
                            <a href="/home">
                                <button
                                    className="text-lg ml-4 tracking-wide font-semibold bg-orange-400 text-white w-24 py-2 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    Salir
                                </button>
                            </a>

                        </h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mt-1 flex flex-col items-center">
                            <div className="w-full flex-1 mt-2">
                                <div className="mx-auto max-w-xs">
                                    <h1 className="font-semibold mt-2">Nombre del negocio</h1>
                                    <input
                                        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2 ${intentoSumbit && !nombre && 'border-red-500'}`}
                                        type="text"
                                        placeholder="Ingresa el nombre de tu negocio"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                    {intentoSumbit && !nombre && <p className="text-red-500">Campo obligatorio</p>}
                                    <h1 className="font-semibold mt-2">Correo electrónico</h1>
                                    <input
                                        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2 ${intentoSumbit && !correo && 'border-red-500'}`}
                                        type="email"
                                        placeholder="Ej: ejemplo@gmail.com"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                    />
                                    {intentoSumbit && !correo && <p className="text-red-500">Campo obligatorio</p>}
                                    <h1 className="font-semibold mt-2">Telefono</h1>
                                    <input
                                        className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-2 ${intentoSumbit && !telefono && 'border-red-500'}`}
                                        type="number"
                                        placeholder="Ej: 77777777"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                    {intentoSumbit && !telefono && <p className="text-red-500">Campo obligatorio</p>}
                                    <h1 className="font-semibold mt-2">Direccion</h1>
                                    <button
                                        className="mt-3 tracking-wide font-semibold bg-orange-400 text-white w-full py-4 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        onClick={openModal}
                                        type="button"
                                    >
                                        <svg className="ml-5 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                        <span>{direccion}</span>
                                    </button>
                                    <div className="mt-5">
                                        <h1 className="font-semibold">Subir Logo</h1>
                                        <label htmlFor="logoInput" className={`ml-20 mt-2 cursor-pointer inline-block ${buttonColor} text-white px-4 py-2 rounded-xl transition duration-300 ease-in-out hover:bg-orange-500`}>
                                            {buttonText}
                                        </label>
                                        <input
                                            id="logoInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e.target.files)}
                                            className="hidden"
                                        />
                                        {selectedFile && (
                                            <p className="mt-2">{selectedFile.name}</p>
                                        )}
                                        {imagen && ( // Agrega esta condición para mostrar la imagen
                                            <div className="flex justify-center items-center w-64 h-64 border border-gray-300 rounded-lg overflow-hidden">
                                                <img src={imagen} alt="Imagen seleccionada" className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex mt-5 font-semibold">
                                        <h1>Hora de entrada</h1>
                                        <h1 className="ml-10">Hora de salida</h1>
                                    </div>
                                    <div className="flex mt-2">
                                        <input
                                            className={`w-1/2 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${intentoSumbit && !horaEntrada && 'border-red-500'}`}
                                            type="time"
                                            placeholder="Hora de entrada"
                                            value={horaEntrada}
                                            onChange={(e) => setHoraEntrada(e.target.value)}
                                        />
                                        {intentoSumbit && !horaEntrada && <p className="text-red-500">Campo obligatorio</p>}
                                        <input
                                            className={`w-1/2 ml-2 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${intentoSumbit && !horaSalida && 'border-red-500'}`}
                                            type="time"
                                            placeholder="Hora de salida"
                                            value={horaSalida}
                                            onChange={(e) => setHoraSalida(e.target.value)}
                                        />
                                        {intentoSumbit && !horaSalida && <p className="text-red-500">Campo obligatorio</p>}
                                    </div>
                                    <div className="mt-5">
                                        <h1 className="font-semibold">Icono en el mapa</h1>
                                        <select
                                            className={`mt-3 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${intentoSumbit && !icono && 'border-red-500'}`}
                                            value={icono}
                                            onChange={(e) => setIcono(e.target.value)}
                                        >
                                            <option value="">Ninguno</option>
                                            <option value="pollo">Pollo</option>
                                            <option value="burger">Hamburguesa</option>
                                            <option value="menu">Pension</option>
                                            <option value="bar">Bebida</option>
                                            <option value="helado">Helado</option>
                                            <option value="cafe">Cafe</option>
                                            <option value="carne">Carne</option>
                                            <option value="saltena">Salteñas</option>
                                            <option value="marisco">Mariscos</option>
                                            <option value="comidaVegetariana">Comida vegetariana</option>
                                            <option value="sushi">Sushi</option>
                                            <option value="panaderia">Panaderia</option>
                                            <option value="pizza">Pizza</option>
                                            <option value="broaster">Pollo Broaster</option>
                                            <option value="torta">Torta</option>
                                        </select>
                                        {intentoSumbit && !icono && <p className="text-red-500">Campo obligatorio</p>}
                                    </div>
                                    <button
                                        className="mt-3 tracking-wide font-semibold bg-orange-400 text-white w-full py-4 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        onClick={openTagPopup}
                                        type="button"
                                    >
                                        Seleccionar etiquetas
                                    </button>
                                    {tagPopupOpen && (
                                        <TagPopup
                                            selectedTags={selectedTags}
                                            onUpdateTags={handleUpdateTags}
                                            onClose={closeTagPopup}
                                        />
                                    )}

                                    <button
                                        className="text-white mt-5 tracking-wide font-semibold bg-orange-400 text-white-500 w-full py-4 rounded-lg hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        type="submit"
                                    >
                                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="#ffffff" d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z" />
                                        </svg>
                                        <span className="ml-2">
                                            Registrar
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex-1 bg-green-100 text-center hidden lg:flex rounded-lg"
                    style={{ backgroundImage: "url('fondo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="m-12 xl:m-16 w-full" />
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ overlay: { zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }, content: { position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', border: 'none', background: 'transparent', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' } }}>
                <div style={{ position: 'relative', width: '80%', height: '80%', zIndex: '1000' }}>
                    <h1 style={{ position: 'absolute', top: '10px', left: '10px' }}>Latitud: {latitud}</h1>
                    <h1 style={{ position: 'absolute', top: '40px', left: '10px' }}>Longitud: {longitud}</h1>
                    <button
                        className="mb-3 mr-4 accept-button mt-3 tracking-wide font-semibold bg-orange-400 text-white py-3 px-5 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        style={{ position: 'absolute', bottom: '20px', right: '10px', zIndex: '1100' }}
                        onClick={closeModal}
                    >
                        Aceptar
                    </button>

                    <MapContainer
                        center={[latitud, longitud]} zoom={13}
                        style={{ width: '100%', height: '100%', zIndex: '1' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapEventHandler />
                    </MapContainer>

                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', zIndex: '1000'
                    }}
                    >
                        <img src="miUbi.png" alt="icono" style={{ width: '32px', height: '32px' }} />
                    </div>

                </div>
            </Modal>

            {registroExitoso && (
                <div className="fixed bottom-0 left-0 w-full bg-green-500 flex justify-center items-center p-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">¡Restaurante registrado exitosamente!</h1>
                        <h2 className="text-xl font-bold text-white">Puedes cerrar esta página</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistroRestaurante;