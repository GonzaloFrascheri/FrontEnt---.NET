# Etapa de build
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Establecer NODE_ENV=production para optimizar el build
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de Nginx personalizada 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de build desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
