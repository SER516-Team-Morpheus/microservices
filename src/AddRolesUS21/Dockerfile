 FROM node:14
 WORKDIR /app
 COPY package*.json ./
 RUN npm install
 COPY . .
 EXPOSE "Port number you want your microservices to be assigned need to update your port" 
 CMD ["npm", "start"]