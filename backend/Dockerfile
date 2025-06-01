FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 8080

# Use custom startup script
CMD ["sh", "./entrypoint.sh"]
