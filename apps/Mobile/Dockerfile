# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose Metro bundler ports
EXPOSE 8081 

# Start Expo using the Docker script from package.json
CMD npm run start:docker
