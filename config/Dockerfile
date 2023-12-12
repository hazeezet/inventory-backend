FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Working directory
WORKDIR /home/node/app

# Copy all node json file
COPY package*.json ./

# Set node to production
ENV NODE_ENV production

# Install the dependencies
RUN npm ci && npm cache clean --force

# Copy the remaining files
COPY . .

# make runner file executable
RUN chmod +x /home/node/app/config/startup.sh

# Set exposed port to listen on in the app
ENV PORT 80

# Expose the port
EXPOSE 80

# Run the server
CMD [ "./config/startup.sh" ]
