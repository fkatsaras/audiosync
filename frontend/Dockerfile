# Use an official Node runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy packege.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the react app
RUN npm run build

# Use a lightweight web server to serve the React app
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Run Ngin
CMD ["nginx", "-g", "daemon off;"]
