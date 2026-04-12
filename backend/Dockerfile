FROM node:18-alpine

WORKDIR /app

# Install required compilers & runtime tools for python, cpp, and java execution
RUN apk add --no-cache python3 g++ openjdk17
# Link python3 to python if not already done
RUN ln -sf python3 /usr/bin/python

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
