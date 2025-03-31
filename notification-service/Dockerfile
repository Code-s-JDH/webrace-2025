FROM node:latest

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

RUN npm run build

COPY . /app

EXPOSE 3100

CMD ["npm", "start"]