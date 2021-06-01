FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk --no-cache add curl
RUN npm config set strict-ssl=false
RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm install \
    && apk del .gyp
COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]