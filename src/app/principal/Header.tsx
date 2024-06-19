"use client";

import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Fragment } from "react";
import React from 'react';
import SearchBar from "../elementos/SearchBar";

const Header = () => {
  return (
    <Popover className="w-full flex items-center border-b-2 px-10 py-2 h-24 bg-white">
      <a href="home" className="flex">
        <img src="noraaOrange.png" className="w-40 h-40 mr-2 hidden sm:block" alt="Noraa Orange Image"/>
        <img src="noraaMini.png" className="w-20 h-10 mr-1 lg:hidden sm:block ml-[-1rem]" alt="Noraa Mini Image"/>
      </a>

       <SearchBar /> 
      <div className="flex-grow" />
      <div className="hidden sm:flex items-center gap-4 md:gap-16 mr-2 mt-1 pr-4">
        <Link href="historial" className="hover:text-orange-500 transition-transform duration-300 transform hover:scale-105" >Historial</Link>
        <Link href="favoritos" className="hover:text-orange-500 transition-transform duration-300 transform hover:scale-105">Favoritos</Link>
        <a href="/login">
          <button type="button" className="hover:text-orange-500 transition-transform duration-300 transform hover:scale-105">Iniciar sesion</button>
        </a>
      </div>
      <div className="flex-grow sm:hidden" />
      <div className="flex items-center justify-end sm:hidden ml-auto">
        <Popover.Button className="absolute rigth-0 inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset">
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </Popover.Button>
      </div>
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opaciity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y-2 divide-gray-50">
            <div className="px-5 pt-5 pb-6 justify-end">
              <div className="flex items-center justify-end">   
                <div className="ml-20"> 
                  <Popover.Button className="inline-flex items-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link 
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2 "
                    href="historial"
                  >
                    Historial
                  </Link>
                  <Link 
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2"
                    href="favoritos"
                  >
                    Favoritos
                  </Link>
                  <Link 
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2"
                    href="perfil"
                  >
                    Perfil
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
export default Header;
