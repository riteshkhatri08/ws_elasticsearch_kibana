const elasticclient = require("./client");

const EARTHQUAKE_INDEX = "earthquake";

// Create a requestHandler function
const queryElastic = async (req, res) => {
  console.log(
    "INCOMING SERACH QUERY REQUEST FOR ELASRIC SEARCH  = >",
    req.query
  );
  const passedType = req.query.type;
  const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  const result = await elasticclient.search(
    {
      index: EARTHQUAKE_INDEX,
      size: 300,
      body: {
        sort: {
          mag: {
            order: passedSortOption,
          },
        },
        query: {
          bool: {
            filter: [
              {
                match: { place: passedLocation },
              },
              {
                term: { type: passedType },
              },
              {
                range: {
                  "@timestamp": {
                    gte: `now-${passedDateRange}d/d`,
                    lt: "now/d",
                  },
                },
              },
              {
                range: {
                  mag: {
                    gte: passedMag,
                  },
                },
              },
            ],
          },
        },
      },
    },
    {
      ignore: [404],
      maxRetries: 3,
    }
  );
  console.log("elastic response = ",result);
  res.json(result.body.hits.hits);
  //   console.log("elastic response = " , res);
  res.end();
};

module.exports = queryElastic;
