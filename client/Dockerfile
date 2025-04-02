# ---- Stage 1: Build the React application ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package.json and lock file
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the application source code
    COPY . .
    
    # Build the application for production
    # This should create a 'dist' folder
    RUN npm run build
    
    # ---- Stage 2: Serve application with Nginx ----
    FROM nginx:stable-alpine
    
    # Remove default Nginx welcome page
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy the built static files from the 'builder' stage
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy our custom Nginx configuration (we'll create this next)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80 (Nginx default)
    EXPOSE 80
    
    # Nginx image's default command starts the server, so no CMD needed here