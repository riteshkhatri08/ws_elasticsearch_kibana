console.log("EARTHQUAKE-APP is starting.....");

// get express module
const express = require("express");
// get elastic search client
const client = require("./elasticsearch/client");

// get express app instance from express module
const app = express();
// to use  cors
const cors = require("cors");

// load data from USGS to elastic index
const data = require("./data_management/retrieve_and_ingest_data");

const queryElastic = require("./elasticsearch/searchQuery");

// enable cors
app.use(cors());

app.use("/ingest_data", data);

// listen on /results and send search request to elasticsearch
app.use("/results", queryElastic);

// set port number
const port = 3001;

// start the app server by listening on above port
app.listen(port, () => {
  console.log("EARTHQUAKE-APP is running.....");
  console.log(`Server listening at http://localhost:${port}`);
});
