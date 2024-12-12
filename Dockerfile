# Stage 1: Build the Angular app
FROM node:18.19.1 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --f

# Install Angular CLI globally (matching the version in package.json)
RUN npm install -g @angular/cli@19.0.0

# Copy the rest of the application code
COPY . .

# Run ngcc (Angular Compatibility Compiler) if needed
RUN npx ngcc || true

# Build the Angular application
RUN npm run build

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine

# Copy the built files from the build stage to the NGINX container
COPY --from=build /app/dist/demo/browser /usr/share/nginx/html

# Expose the port NGINX is running on
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
