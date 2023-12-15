FROM node:alpine

WORKDIR /sur/src/app

COPY . .

RUN npm install

RUN npm install express

RUN pm install express body-parser

CMD [ "npm", "start" ]