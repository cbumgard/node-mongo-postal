exports.savePostalCode = function(dbCollection, postalCode) {
  console.log("Saving postal code: %s", JSON.stringify(postalCode));
  dbCollection.save(postalCode);
};

exports.findPostals = function(params, callback) {
  // Extract the params:
  var dbCollection, zipcode, radiusMiles, maxResults;
  var errMsg = null;
  if (params.dbCollection == null) {
    errMsg += "Database collection not provided. ";
  }
  if (params.zipcode == null) {
    errMsg += "Zipcode not provided. ";
  }
  if (errMsg != null) {
    callback(errMsg);
    return;
  } else {
    dbCollection = params.dbCollection;
    zipcode = params.zipcode;
    radiusMiles = params.radiusMiles ? params.radiusMiles : 10;
    maxResults = params.maxResults ? params.maxResults : 100;
  }

  // Run the query:
  dbCollection.findOne({zipcode: zipcode.toString()}, function(err, postalObj) {
    if (err) {
      callback(err);
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

  /**
   * Convert the miles to degrees.
   * @param miles
   * @return degrees
   */
  function milesToDegrees(miles) {
    var EARTH_RADIUS_MILES = 3959; // miles
    return miles / EARTH_RADIUS_MILES;
  }
};

exports.setUpIndexing = function(dbCollection) {
  console.log("Setting up zipcode indexing");
  dbCollection.ensureIndex( { zipcode: 1 } );
  console.log("Setting up location indexing");
  dbCollection.ensureIndex( { loc: "2d" } );
};

exports.initDb = function(config) {
  var mongo = require('mongoskin');
  var authStr = config.mongo.auth ? (config.mongo.auth.name + ':' + config.mongo.auth.pass) + '@' : '';
  var connectStr = config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbname;
  return mongo.db(authStr + connectStr + '?auto_reconnect=true');
};