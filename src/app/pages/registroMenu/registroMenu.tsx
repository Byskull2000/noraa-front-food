"use client";
import { cargarMenusDeUnRestaurante, cargarRestaurantesPorEmail } from '@/app/utiles/consultores/restaurantes';
import React, { useEffect, useState } from 'react';

const RegistroMenu: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [intentoSumbit, setIntentoSumbit] = useState(false);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [registroFinalizado, setRegistroFinalizado] = useState(false);
    const [contador, setContador] = useState(10);
    const [email, setEmail] = useState('');
    const [restauranteEncontrado, setRestauranteEncontrado] = useState(false);
    const [restauranteFk, setRestauranteFk] = useState<number | null>(null); 

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (registroFinalizado) {
            interval = setInterval(() => {
                setContador((prevContador) => prevContador - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [registroExitoso]);

    useEffect(() => {
        if (contador === 0) {
            window.close();
        }
    }, [contador]);

    const playSuccessSound = () => {
        const audio = new Audio('correcto.mp3');
        audio.play();
    };

    const buscarRestaurante = async () => {
        try {
            const data = await cargarRestaurantesPorEmail(email);
            if (data && data.length > 0) {
                setRestauranteFk(data[0].id_restaurante);
                console.log(data[0].id_restaurante);
                console.log(restauranteFk);
                setRestauranteEncontrado(true);
            } else {
                console.error('No hay restaurantes con ese correo');
                setRestauranteEncontrado(false);
            }
        } catch (error) {
            console.error('Error al buscar el restaurante:', error);
            setRestauranteEncontrado(false);
        }
    };

    const handleRegistroTerminado = async () => {
        setRegistroFinalizado(true);
        playSuccessSound();
    }


    const handleRegistroMenu= async (event: React.FormEvent) => {

        event.preventDefault();
        if (!nombre) {
            setIntentoSumbit(true);
            return;
        }
        console.log(restauranteFk);
        try {
            const response = await fetch('https://noraa-backend-6v2teu43ta-tl.a.run.app/menu-registrar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    vigencia: 1,
                    restaurante_fk: restauranteFk
                })
            });
            if (response.ok) {
                console.log('Menu registrado exitosamente');
                setRegistroExitoso(true);
                playSuccessSound();
                limpiarCampos();
            } else {
                console.error('No se pudo registrar el menu:', response.statusText);
            }
        } catch (error) {
            console.error('Error al registrar el menu:', error);
        }
    };

    const limpiarCampos = () => {
        setNombre('');

        document.getElementById("nombre")?.setAttribute("value", "");
        setRegistroExitoso(false);
    };

    return (
        <div>
            <div className={`min-h-screen ${registroExitoso ? 'bg-green-500' : 'bg-orange-700'} text-gray-900 flex justify-center`} style={{ backgroundImage: `url('/fondoPlato.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                        <h1 className="font-bold text-2xl mt-2">Registro de Menus</h1>
                        <form>
                            <div className="mt-1 flex flex-col items-center">
                                <div className="w-full flex-1 mt-7">
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo electrónico del restaurante</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 block w-full p-2.5"
                                            placeholder="restaurante@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {!restauranteEncontrado && (
                                        <div className="mt-2 flex justify-center">
                                            <button
                                                className="mt-3 tracking-wide font-semibold bg-orange-400 text-white w-full py-4 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                                type="button"
                                                onClick={buscarRestaurante}
                                            >
                                                Buscar Restaurante
                                            </button>
                                        </div>
                                    )}
                                    {restauranteEncontrado && (
                                        <div className="mt-96">
                                            <p className="mr-4">Terminaste de registrar tu menú?</p>
                                            <a className="text-orange-400 underline" href="platosPage">
                                                <button type = "button" className='mt-3 tracking-wide font-semibold bg-orange-400 text-white w-full py-4 rounded-3xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'>
                                                    Registrar tus platillos
                                                </button>
                                            </a>
                                        </div>

                                    )}
                                </div>
                                <div className="mx-auto max-w-xs">
                                    <button
                                        className="text-white mt-5 tracking-wide font-semibold bg-orange-400 text-white-500 w-36 py-4 rounded-lg hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        type="submit"
                                        onClick={handleRegistroTerminado}
                                    >
                                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="#ffffff" d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z" />
                                        </svg>
                                        <span className="ml-2">Guardar</span>
                                    </button>

                                </div>

                            </div>

                        </form>
                    </div>
                    {restauranteEncontrado && (
                        <div className="flex-1 bg-slate-100 text-center hidden lg:flex flex-col rounded-lg p-6">
                            <div className="flex items-center mb-5 w-full mt-16">
                                <div className="flex flex-col w-1/2 mr-2">
                                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 text-left">Nombre del Menu</label>
                                    <input
                                        id="nombre"
                                        className={`px-6 py-4 rounded-lg font-medium bg-white border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${intentoSumbit && !nombre && 'border-red-500'}`}
                                        type="text"
                                        placeholder="Nombre del Menu"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="flex justify-center mt-10">
                                <button
                                    className="text-white tracking-wide font-semibold bg-orange-400 text-white-500 w-40 py-4 rounded-xl hover:bg-orange-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    type="button"
                                    onClick={handleRegistroMenu}
                                >
                                    <span className="ml-2">Registrar Menu</span>
                                </button>
                            </div>


                        </div>
                    )}
                </div>
                {registroExitoso && (
                    <div className="fixed bottom-0 left-0 w-full bg-green-500 flex justify-center items-center p-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">¡Platillos registrados exitosamente!</h1>
                            <p className="text-white">{`Platillo: ${nombre}`}</p>
                        </div>
                    </div>
                )}

                {registroFinalizado && (
                    <div className="fixed bottom-0 left-0 w-full bg-blue-500 flex justify-center items-center p-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">¡Registro terminado exitosamente!</h1>
                            <p className="text-white">{`Cerrando esta pagina en ${contador} segundos`}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistroMenu;
