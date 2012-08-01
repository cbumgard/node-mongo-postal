var Step = require('step');

exports.savePostalCode = function(dbCollection, postalCode) {
  console.log("Saving postal code: %s", JSON.stringify(postalCode));
  dbCollection.save(postalCode);
};

/**
 * Find postal objects (objects with a postal/zipcode) within a specific radius from a zipcode, sorted in ascending order by nearest first.
 * @param params: object containing the following parameters:
 *                dbCollection - Name of a MongoDB collection object that we can query against. Required.
 *                selectorAttr - Name of the attribute in dbCollection that we can select zipcodes from. Defaults to "zipcode".
 *                zipcode - a zipcode to use as the basis of the search. Required.
 *                radiusMiles - radius in miles from the zipcode to search. Optional, uses 10 by default.
 * @callback: callback function that gets passed (err, postals) 
 *            where err is an error if encountered, or null otherwise. postals is an array of postal objects.
 */
exports.findPostals = function(params, callback) {
  var paramDefaults = {
    selectorAttr : "zipcode"
  };
  if (!params || params === null) {
    throw new Error("No parameters object provided");
  }
  if (!params.dbCollection || params.dbCollection === null) {
    throw new Error("Database collection not provided");
  }
  if (!params.selectorAttr || params.selectorAttr === null) {
    params.selectorAttr = paramDefaults.selectorAttr;
  }
  if (!params.zipcode || params.zipcode === null) {
    throw new Error("Zipcode not provided");
  }
  if (!callback || callback === null) {
    throw new Error("No callback function provided");
  }
  // Extract the params:
  var dbCollection, selectorAttr, zipcode, radiusMiles;  
  dbCollection = params.dbCollection;
  selectorAttr = params.selectorAttr;
  zipcode = params.zipcode;
  radiusMiles = params.radiusMiles ? params.radiusMiles : 10;
  // Run the query:
  var query = {};
  query[selectorAttr] = zipcode.toString();
  Step(
    // Look up the zipcode and pass the matching document with lat/long coords to the next step:
    function zipcodeToCoords() {
      dbCollection.findOne(query, this);      
    },
    // Take the lat/long coords and search for other zipcodes nearby:
    function findNearCoords(err, postalObj) {
      if (err) throw err;
      if (!postalObj || postalObj === null) {
        throw new Error("No postal object found for zipcode "+zipcode+" using document attribute "
          +selectorAttr+"; make sure postal data has been loaded.");
      }
      var geoSearchParams = { 
        loc : { 
          $nearSphere : postalObj.loc, 
          $maxDistance : milesToDegrees(radiusMiles) 
        } 
      };
      dbCollection.find(geoSearchParams).toArray(this);
    },
    // Finally invoke the user-specified callback to handle found zipcodes:
    callback 
  );
};

/**
 * Convert the miles to degrees.
 * @param miles
 * @return degrees
 */
function milesToDegrees(miles) {
  var EARTH_RADIUS_MILES = 3959; // miles
  return miles / EARTH_RADIUS_MILES;
}

exports.setUpIndexing = function(dbCollection) {
  console.log("Ensuring index on zipcode");
  dbCollection.ensureIndex( { zipcode: 1 } );
  console.log("Ensuring 2d geospatial index on loc");
  dbCollection.ensureIndex( { loc: "2d" } );
};

exports.initDb = function(config) {
  var mongo = require('mongoskin');
  var authStr = config.mongo.auth ? (config.mongo.auth.name + ':' + config.mongo.auth.pass) + '@' : '';
  var connectStr = config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbname;
  var fullConnectStr = authStr + connectStr + '?auto_reconnect=true';
  return mongo.db(fullConnectStr);
};