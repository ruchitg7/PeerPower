# Use an official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose the port your app uses (adjust if needed)
EXPOSE 3002

# Start the app
CMD ["npm", "start"]
