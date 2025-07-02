# Etapa de build
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Declarar ARGs para recibir las variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_API_BASE_URL

# Convertir ARGs en ENVs dentro del contenedor
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

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
