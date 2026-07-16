# Step 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all frontend files
COPY . .

# Argument to pass the backend API base URL at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the project (generates files in /app/dist)
RUN npm run build

# Step 2: Production serve stage
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from the build stage to Nginx web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (standard Nginx port)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
