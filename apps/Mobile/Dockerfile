FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @expo/ngrok@4.1.0

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel", "--clear"]
