# Dockerfile
FROM node:23

WORKDIR /app

COPY package*.json ./
RUN npm install 
 
COPY . .
RUN npx prisma generate


CMD ["node","src/index.js"]