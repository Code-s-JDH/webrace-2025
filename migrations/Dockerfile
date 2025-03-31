FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json (if available) first for better caching
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app


# Start the application
CMD ["npm", "run", "migrate"]