# Dockerfile
FROM node:23

WORKDIR /app

COPY package*.json ./
RUN npm install 
RUN apt-get update && apt-get install -y 


COPY . .



CMD ["node","src/index.js"]