FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src /app

EXPOSE 3000

CMD ["npm", "start"]
