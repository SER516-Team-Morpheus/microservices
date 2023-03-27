# Running microservices
**Steps to run the microservices:**
1. Make sure you have node.js and docker installed in your local PC. 
    If not, please use the below links to download and install:
    
    Node.js - https://nodejs.org/en/download
    
    Docker - https://www.docker.com/products/docker-desktop/

2. Clone the repository to your local.
3. Make sure docker is running.
4. Open terminal and go to your {project}/src folder.
5. Run docker-compose up to build your image and the container.
6. Once the image are built, you can test the microservices using the api-gateway, or you will be able to hit the microservice directly.

# Devlopment of microservices
**For developers to develop new microservices:**
1. Create a new directory with the name of microservices you want to develop.
    command - mkdir directory_name
2. Go inside the created directory and initialize the node project.
    command -
    ```bash
    cd directory_name 
    npm init
    ```
3. The above command should create a package.json file.
4. Install the required dependencies like **express**, **axios**, **dotenv**, **jest** which will be required to develop the microservices.
    command - 
    ```bash
    npm install dependencies_name
    ```
    All the dependencies should be updated in your package.json file.
    Make sure to update the script under package.json as:
      ```bash
        "scripts": {
          "start": "node index.js",
          "test": "jest"
        },
      ```
5. Create files inside your directory, namely **index.js**, **logic.js**, **test.js** and **Dockerfile**. 

    index.js - This will have your endpoints of your microservices.
    
    logic.js - This will have the logic of the endpoints.
    
    test.js  - This will have your test case to test the microservices based on jest framework.
    
    
    Dockerfile should have the following code:
     ```bash
      FROM node:14
      WORKDIR /app
      COPY package*.json ./
      RUN npm install
      COPY . .
      EXPOSE "Port number you want your microservices to be assigned"
      CMD ["npm", "start"]
      ```

6. Once you are done developing and testing your microservice, you should update the **docker-compose.yml** file and the **api-gateway** to handle your microservice.


**Updating api-gateway:**
1. Open the **gateway.config.yml** file under config directory of api-gateway.
2. Under apiEndpoints add your microservice by deving the host and paths.
    Example:
     ```bash
      apiEndpoints:
        exampleservice:
          host: localhost
          paths: "/exampleService"
      ```
3. Under serviceEndpoint add your microservice url:

    Example:
    
     ```bash
      serviceEndpoints:
        exampleservice:
          url: "http://exampleservice:port"
      ```
          
4. Under pipeline, update your service pipeline and link serviceEndpoint with apiEndpoint.
    Example:
     ```bash
      examplePipeline:
        apiEndpoints:
          - exampleservice
        policies:
          # Uncomment `key-auth:` when instructed to in the Getting Started guide.
          # - key-auth:
          - proxy:
              - action:
                  serviceEndpoint: exampleservice
                  changeOrigin: true
                  
      ```

**Updating docker-compose.yml:**
1. Add your microservice and give your buildpath and the ports you want your microservice to be exposed on.
    Example:
     ```bash
        exampeleservice:
            build: ./exampleservice
            ports:
              - "port:port"
            env_file:
              - .env
     ```
