FROM node:alpine

WORKDIR /sur/src/app

COPY . .

RUN npm install

CMD [ "npm", "start" ]