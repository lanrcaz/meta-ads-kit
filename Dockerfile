FROM node:20-slim

# Install system dependencies for shell scripts
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Install social-cli globally
RUN npm install -g @vishalgojha/social-cli

WORKDIR /app

# Copy package files and install dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

# Copy the full project (scripts, skills, config)
COPY . .

# The server reads scripts from the project root
WORKDIR /app/server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:3000/webhooks/health || exit 1

CMD ["node", "src/index.js"]
