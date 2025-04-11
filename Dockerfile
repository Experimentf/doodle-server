FROM node:23-alpine AS base

# Set the working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the remaining files
COPY . .

# Expose port for backend
EXPOSE 5000

CMD [ "npm", "run", "start" ]