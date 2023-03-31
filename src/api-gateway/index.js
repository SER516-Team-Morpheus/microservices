const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// Authentication microservice
app.post(
  "/authenticate",
  createProxyMiddleware({
    target: "http://localhost:3001/authenticate",
    changeOrigin: true,
  })
);
console.log("test");

// Project microservice
app.post(
  "/createProject",
  createProxyMiddleware({
    target: "http://localhost:3002/createProject",
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`API Gateway server running on port ${port}`);
});
