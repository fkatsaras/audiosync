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

# Use a lightweight Node.js-based server for serving the React app
FROM node:18

# Install `serve` globally
RUN npm install -g serve

# Copy the build files from the previous stage
COPY --from=build /app/build /app/build

# Expose port 3000
EXPOSE 3000

# Run the `serve` command to serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]