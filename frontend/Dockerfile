FROM node:20

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application
COPY . .

# Update the proxy field in package.json
RUN sed -i 's|"http://localhost:5000"|"http://audiosync-backend.onrender.com:5000"|' package.json

# Expose the required port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
