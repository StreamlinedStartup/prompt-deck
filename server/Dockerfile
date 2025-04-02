# ---- Base Node ----
# Use a specific Node.js LTS version. Alpine versions are smaller.
FROM node:18-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# ---- Dependencies ----
# Install dependencies including devDependencies needed for build
FROM base AS deps
RUN npm install

# ---- Build ----
# Copy source code and build the application
FROM deps AS build
COPY . .
# Ensure tsconfig.json specifies "outDir": "./dist"
RUN npm run build

# ---- Production ----
# Start fresh from the base image
FROM base AS production

# Copy production dependencies and built code from previous stages
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# Optional: Prune dev dependencies if you didn't use --only=production earlier
# RUN npm prune --production

# Expose the port the app runs on (ensure this matches your .env or default)
# This is informational for Docker, the actual port is set by the app/env var
EXPOSE 5032

# Define the command to run the application
# Use node directly to run the compiled JavaScript
CMD [ "node", "dist/server.js" ]