# ------------------------------
# nginx base
# ------------------------------
FROM nginx:1.28-alpine AS nginx

RUN apk add --no-cache curl

# copy nginx configuration
COPY docker/ui/nginx.conf /etc/nginx/nginx.conf

# ------------------------------
# dependencies
# ------------------------------
FROM node:22-slim AS deps

WORKDIR /usr/src

# copy the dependencies configuration
COPY apps/ui/package*.json ./apps/ui/
COPY package*.json ./
COPY packages/ ./packages/

# install dependencies
RUN npm install

# ------------------------------
# application code
# ------------------------------
FROM node:22-slim AS build

WORKDIR /usr/src

# copy the dependencies from the previous stage
COPY --from=deps /usr/src/ ./
COPY apps/ui/ ./apps/ui/

# build the application
RUN npm run build -w @pk/ui

# ------------------------------
# final image
# ------------------------------
FROM nginx AS prod

# copy the built application
COPY --from=build /usr/src/apps/ui/dist /usr/share/nginx/html

EXPOSE 8080
