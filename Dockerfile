# Usa una imagen oficial de Node
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expón el puerto de la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "crud-vendedores/app.js"]
