# syntax=docker/dockerfile:1.6
FROM node:20-alpine

WORKDIR /app

# Install deps separately for better caching
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

EXPOSE 5173

# Run Vite dev server bound to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
