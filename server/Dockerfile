FROM node:7.8.0

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install babel-cli

RUN npm install && npm run build

EXPOSE 4000

CMD ["npm", "start"]
