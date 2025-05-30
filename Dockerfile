FROM node:22-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

CMD ["npm", "start"]
