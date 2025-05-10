# ------------------------------
# dependencies
# ------------------------------
FROM node:22-slim AS deps

WORKDIR /usr/src

# add curl to perform health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# copy the dependencies configuration
COPY apps/server/package*.json ./apps/server/
COPY package*.json ./
COPY packages/ ./packages/

# install dependencies
RUN npm ci

# ------------------------------
# application code
# ------------------------------
FROM node:22-slim AS build

WORKDIR /usr/src

# copy the dependencies from the previous stage
COPY --from=deps /usr/src/ ./
COPY apps/server/ ./apps/server/

# ------------------------------
# final image
# ------------------------------
FROM node:22-slim AS prod

# create a non-root user to run the application
RUN useradd -m server
USER server

WORKDIR /usr/src

COPY --from=deps /usr/bin/curl /usr/bin/
COPY --from=deps /usr/lib/ /usr/lib/
COPY --from=build /usr/src/ ./

CMD ["npm", "run", "start", "-w", "@pk/server"]

EXPOSE 5000

