FROM node:7.8.0

COPY ./package.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

COPY . /usr/src/app/

EXPOSE 3000

CMD ["npm", "start"]
