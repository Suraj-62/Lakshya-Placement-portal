FROM node:18-alpine

WORKDIR /app

# Install dependencies and build
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Accept build-time arguments for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Build the Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
