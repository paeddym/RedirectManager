FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install express

RUN npm install express body-parser

RUN npm install dotenv

CMD [ "npm", "start" ]