# Use a Node.js runtime as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the source code to the container
COPY process.js package.json /app/

# Install the dependencies
RUN npm install

# Start the process when the container is launched
CMD [ "node", "process.js" ]
