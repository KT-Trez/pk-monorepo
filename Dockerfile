FROM node:18

WORKDIR /usr/src/app

COPY dist ./dist
COPY package*.json ./
RUN npm ci

CMD ["npm", "run", "start"]
