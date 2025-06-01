# Stage 1: Build the Vite app
FROM node:20 AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Build the Vite app
RUN pnpm build

# Stage 2: Serve the static files using `serve`
FROM node:20-alpine

WORKDIR /app

# Install the `serve` package globally
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist .

# Expose port 3000
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", ".", "-l", "3000"]
