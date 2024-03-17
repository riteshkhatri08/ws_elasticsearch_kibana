// AXIOS TO SEND EQUEST TO SERVER
import axios from "axios";
// TO MANAGE STATE
import { useState } from "react";
import "./App.css";

const App = () => {
  // fields to save state from select input options
  // ype of event
  const [chosenType, setChosenType] = useState(null);
  // magnitude
  const [chosenMag, setChosenMag] = useState(null);
  // Location
  const [chosenLocation, setChosenLocation] = useState(null);
  // date range
  const [chosenDateRange, setChosenDateRange] = useState(null);
  // sort by ?
  const [chosenSortOption, setchosenSortOption] = useState(null);
  // list of documents fetched from server
  const [documents, setDocuments] = useState(null);
  // Create a function to send search request to server

  const sendSearchRequest = () => {
    // Results variable to hold input param
    const results = {
      // Request method will be get
      method: "GET",
      // backend node js server url
      url: "http://localhost:3001/results",
      params: {
        type: chosenType,
        mag: chosenMag,
        location: chosenLocation,
        dateRange: chosenDateRange,
        sortOption: chosenSortOption,
      },
    };

    // send input param in axios request
    axios
      .request(results)
      // when response comes invoke this call back funcion
      .then((response) => {
        // Log responses to console
        console.log(response.data);
        // update response data in documents State
        setDocuments(response.data);
      })
      // else log the error on console
      .catch((error) => {
        console.error(error);
      });
  };

  // return this jsx element which extracts fields from documents state
  // and populates cards for each earthquake event
  return (
    <div className="app">
      {/* NAV BAR */}
      <nav>
        <ul className="nav-bar">
          <li>Earthquake Watch</li>
        </ul>
      </nav>
      <p className="directions">
        {" "}
        Search for earthquakes using the following criteria:
      </p>

      {/* MAIN DIV ELEMENT THAT CONTAINS  INPUT FIELDS FOR SEARCH CRITERIAS */}
      <div className="main">
        <div className="type-selector">
          <ul>
            <li>
              <select
                name="types"
                id="types"
                value={chosenType}
                onChange={(e) => setChosenType(e.target.value)}
              >
                <option value={null}>Select a Type</option>
                <option value="earthquake">Earthquake</option>
                <option value="quarry blast">Quarry Blast</option>
                <option value="ice quake">Ice Quake</option>
                <option value="explosion">Explosion</option>
              </select>
            </li>

            {/*  DROPDOWN FOR MAGNITUDE LEVEL */}
            <li>
              <select
                name="mag"
                id="mag"
                value={chosenMag}
                onChange={(e) => setChosenMag(e.target.value)}
              >
                <option value={null}>Select magnitude level</option>
                <option value="2.5">2.5+</option>
                <option value="5.5">5.5+</option>
                <option value="6.1">6.1+</option>
                <option value="7">7+</option>
                <option value="8">8+</option>
              </select>
            </li>

            {/*  FORM FOR LOCATION INPUT */}
            <li>
              <form>
                <label>
                  <input
                    className="form"
                    type="text"
                    placeholder="Enter city, state, country"
                    value={chosenLocation}
                    onChange={(e) => setChosenLocation(e.target.value)}
                  />
                </label>
              </form>
            </li>

            {/*  INPUT DROP DOWN FOR DATE RANGE */}
            <li>
              <select
                name="dateRange"
                id="dateRange"
                value={chosenDateRange}
                onChange={(e) => setChosenDateRange(e.target.value)}
              >
                <option value={null}>Select date range</option>
                <option value="7">Past 7 Days</option>
                <option value="14">Past 14 Days</option>
                <option value="21">Past 21 Days</option>
                <option value="30">Past 30 Days</option>
              </select>
            </li>
            {/*  INPUT DROP DOWN FOR SORTING OPTION */}
            <li>
              <select
                name="sortOption"
                id="sortOption"
                value={chosenSortOption}
                onChange={(e) => setchosenSortOption(e.target.value)}
              >
                <option value={null}>Sort by</option>
                <option value="desc">Largest Magnitude First</option>
                <option value="asc">Smallest Magnitude First</option>
              </select>
            </li>
            {/*  BUTTONT TO SEND SEARCH REQUESTs */}
            <li>
              <button onClick={sendSearchRequest}>Search</button>
            </li>
          </ul>
        </div>

        {/*  POPULATE CARDS THAT SHOW EARTHQUAKE DATA FROM DOCUMENTS */}
        {documents && (
          <div className="search-results">
            {documents.length > 0 ? (
              <p> Number of hits: {documents.length}</p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
            {documents.map((doc) => (
              <div className="results-card">
                <div className="results-text">
                  <p>Type: {doc._source.type}</p>
                  <p>Time: {doc._source["@timestamp"]}</p>
                  <p>Location: {doc._source.place}</p>
                  <p>Latitude: {doc._source.coordinates.lat}</p>
                  <p>Longitude: {doc._source.coordinates.lon}</p>
                  <p>Magnitude: {doc._source.mag}</p>
                  <p>Depth: {doc._source.depth}</p>
                  <p>Significance: {doc._source.sig}</p>
                  <p>Event URL: {doc._source.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
