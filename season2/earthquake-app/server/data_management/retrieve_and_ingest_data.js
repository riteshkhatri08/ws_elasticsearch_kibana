// import express module dependencies
const express = require("express");

// to create routes that handle http request
const router = express.Router();

// to make outbound calls to GeoJSON for data on earhtquakes
const axios = require("axios");

// elastic client
const client = require("../elasticsearch/client");

// for logging
require("log-timestamp");

// USGS URl - data source
const SRC_URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;

// create a /earthquake GET route
router.get("/earthquakes", async function (req, res) {
  console.log("Loading Application...");
  res.json("Running Application...");

  // define an async function to fetch index data
  indexData = async () => {
    try {
      console.log("Retrieving data from the USGS API");

      // axios to make a get request to SRC_URL
      const EARTHQUAKES = await axios.get(`${SRC_URL}`, {
        headers: {
          "Content-Type": ["application/json", "charset=utf-8"],
        },
      });

      console.log("Data retrieved!");

      results = EARTHQUAKES.data.features;

      console.log("Indexing data...");

      results.map(
        async (results) => (
          (earthquakeObject = {
            place: results.properties.place,
            time: results.properties.time,
            tz: results.properties.tz,
            url: results.properties.url,
            detail: results.properties.detail,
            felt: results.properties.felt,
            cdi: results.properties.cdi,
            alert: results.properties.alert,
            status: results.properties.status,
            tsunami: results.properties.tsunami,
            sig: results.properties.sig,
            net: results.properties.net,
            code: results.properties.code,
            sources: results.properties.sources,
            nst: results.properties.nst,
            dmin: results.properties.dmin,
            rms: results.properties.rms,
            mag: results.properties.mag,
            magType: results.properties.magType,
            type: results.properties.type,
            longitude: results.geometry.coordinates[0],
            latitude: results.geometry.coordinates[1],
            depth: results.geometry.coordinates[2],
          }),
          // send data to elasticsearch earthquake index via  ingest pipeline
          await client.index({
            index: "earthquake",
            id: results.id,
            body: earthquakeObject,
            pipeline: "earthquake_app_ingest_pipeline",
          })
        )
      );

      if (EARTHQUAKES.data.length) {
        indexData();
      } else {
        console.log("Data has been indexed successfully!");
      }
    } catch (err) {
      console.log(err);
    }

    console.log("Preparing for the next round of indexing...");
  };
  // invoke async function
  indexData();
});

module.exports = router;
