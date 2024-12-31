
# Use Debian 12 as the base image
FROM debian:12

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=18 \
    PATH="/usr/local/bin:$PATH"

# Install dependencies and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g typescript && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm i -g ts-node
RUN npm install

# Copy the rest of the application source code
COPY . ./

# Compile TypeScript code
#RUN tsc
RUN npm run build

# Expose the application port
#EXPOSE 3000

# Define the command to start the application
#CMD ["npm", "start"]

ENTRYPOINT ["/usr/src/app/run_webserver.ts"]


# docker build -t freemining-react:0.1 .

# docker run --name freemining-react --rm -p 3677:3677 freemining-react:0.1
