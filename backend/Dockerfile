FROM node:20

# Install build tools required for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy application files
COPY . .

# Expose the port and run the app
EXPOSE 8080
CMD ["pnpm", "dev"]
