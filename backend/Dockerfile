FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
