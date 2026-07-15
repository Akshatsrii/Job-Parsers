FROM mcr.microsoft.com/playwright:v1.61.1-jammy

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including Playwright
RUN npm ci

# Install Chromium browser binaries
RUN npx playwright install chromium

# Copy project files
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
