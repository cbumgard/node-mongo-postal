// Parse command-line options:
var argv = require('optimist')
  .usage('Usage: $0 -c [configFile] -z [zipcode] -r [radius] -m [max]')
  .demand(['c'])
  .alias('c', 'config')
  .describe('c', 'Absolute path to a Javascript configuration file, e.g. /tmp/local.config.js')
  .alias('z', 'zipcode')
  .describe('z', 'Zipcode to search around')
  .alias('r', 'radius')
  .describe('r', 'Radius of the search')
  .argv
;

// Initialize a connection to MongoDB:
var mongoPostal = require('../lib/mongo-postal');
console.log("Using MongoDB settings in configuration file: %s", argv.config);
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(argv.config, 'utf-8'));
var collection = mongoPostal.initDb(config).collection(config.mongo.collection);

var params = {
  dbCollection : collection,
  zipcode : argv.zipcode ? argv.zipcode : "94102"
};
if (argv.radius) params.radiusMiles = argv.radius;

mongoPostal.findPostals(params, function(err, postals) {
  if (err) {
    console.error("Failed to get postals: %s", err);
    process.exit(1);
  } else {
    postals.forEach(function(postal) {
      console.log("Found: %s", JSON.stringify(postal));
    });
    console.log("Found %d postals", postals.length);
    process.exit();
  }
});