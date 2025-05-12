# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build frontend and backend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy backend
COPY --from=builder /app/backend ./backend

# Install production dependencies only
RUN npm install --omit=dev && \
    npm install --prefix backend --omit=dev

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]