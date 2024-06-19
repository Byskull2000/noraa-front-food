# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del frontend
RUN npm install

# Copia el resto de los archivos del frontend al contenedor
COPY . .

# Construye la aplicación del frontend
RUN npm run build

# Expone el puerto que utiliza tu frontend
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
