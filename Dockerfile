# Use the official Node.js runtime as a base image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port (change this to match your application's port)
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]
