// Modules
const express = require('express');
const app = express();
var cors = require('cors')
const routes = require('./src/routes/index');

// CORS
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ],
  
    allowedHeaders: [
        'Authorization',
        'Content-Type'
    ],
  };
  


// Middlewares
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration
const port = 3002
app.use(routes);


app.listen(port);
//app.listen(process.env.PORT || 5000)
console.log(`Server on port: ${port}`);