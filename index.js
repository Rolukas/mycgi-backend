// Modules
const express = require("express");
const app = express();
var cors = require("cors");
const routes = require("./src/routes/index");

// CORS
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE"],

  allowedHeaders: ["Authorization", "Content-Type"],
};

// Middlewares
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration
app.use(routes);

const port = process.env.PORT || 3002;
app.listen(port);
console.log(process.env);
console.log(`Server on port: ${port}`);
