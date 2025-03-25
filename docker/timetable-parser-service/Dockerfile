FROM node:20

WORKDIR /usr/src/app

COPY dist ./dist
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

CMD ["npm", "run", "start"]
