FROM node:18

WORKDIR /usr/src/app

COPY dist ./
COPY package*.json ./
RUN npm ci

CMD ["node", "index.js"]