FROM node:20-bullseye-slim

# Install Python and FFmpeg (required for yt-dlp and media conversions)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy application files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
