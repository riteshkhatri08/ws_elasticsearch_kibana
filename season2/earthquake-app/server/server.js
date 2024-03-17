console.log("EARTHQUAKE-APP is starting.....");

// get express module
const express = require("express");
// get elastic search client
const client = require('./elasticsearch/client');

// get express app instance from express module
const app = express();

// load data from USGS to elastic index
const data = require('./data_management/retrieve_and_ingest_data');

app.use('/ingest_data', data);

// set port number
const port = 3001;

// start the app server by listening on above port
app.listen(port, () => {
  console.log("EARTHQUAKE-APP is running.....");
  console.log(`Server listening at http://localhost:${port}`);
});
