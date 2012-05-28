exports.savePostalCode = function(dbCollection, postalCode) {
  console.log("Saving postal code: %s", JSON.stringify(postalCode));
  dbCollection.save(postalCode);
};

/**
 * Find postal objects (objects with a postal/zipcode) within a specific radius from a zipcode, sorted in ascending order by nearest first.
 * @param params: object containing the following parameters:
 *                dbCollection - a MongoDB collection object that we can query against. Required.
 *                zipcode - a zipcode to use as the basis of the search. Required.
 *                radiusMiles - radius in miles from the zipcode to search. Optional, uses 10 by default.
 *                maxResults - max number of postal object results. Optional, uses 10 by default.
 * @callback: callback function that gets passed (err, postals) 
 *            where err is an error if encountered, or null otherwise. postals is an array of postal objects.
 */
exports.findPostals = function(params, callback) {
  if (!params || params === null) {
    throw new Error("No parameters object provided");
  }
  if (!params.dbCollection || params.dbCollection === null) {
    throw new Error("Database collection not provided");
  }
  if (!params.zipcode || params.zipcode === null) {
    throw new Error("Zipcode not provided");
  }
  if (!callback || callback === null) {
    throw new Error("No callback function provided");
  }
  // Extract the params:
  var dbCollection, zipcode, radiusMiles, maxResults;  
  dbCollection = params.dbCollection;
  zipcode = params.zipcode;
  radiusMiles = params.radiusMiles ? params.radiusMiles : 10;
  maxResults = params.maxResults ? params.maxResults : 10;
  // Run the query:
  dbCollection.findOne({zipcode: zipcode.toString()}, function(err, postalObj) {
    if (err) {
      callback(err);
      return;
    }
    if (!postalObj || postalObj === null) {
      callback("No postal object found for zipcode "+zipcode+"; make sure postal data has been loaded.");
      return;
    }
    dbCollection.find(
      { loc : { $nearSphere : postalObj.loc, $maxDistance : milesToDegrees(radiusMiles) } },
      { limit: maxResults })
      .toArray(function (err, postals) {
        var i;
        if (err) {
          callback(err);
        } else {
          callback(null, postals);
        }
      });
  });

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