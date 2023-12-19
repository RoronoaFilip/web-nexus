# Pull a node package
FROM node:20.9.0

# Define a working directory of the Docker container. Any command will be executed in this
# specific directory.
WORKDIR /usr/source/app

# Copy from local directory, i.e. this project, all *package*.json files.
# The "./" means the current working directory.
COPY package*.json ./

# All dependencies will me installed from the package.json file.
RUN npm install

# Now we are going to copy everything from our sorce folder to
# the working directory
COPY . .

# Exposing the port of the app
EXPOSE 8080

# Executing command
CMD ["npm", "run", "start"]

