// Parse command-line options:
var argv = require('optimist')
  .usage('Usage: $0 -f [geonamesFile] -c [configFile]')
  .demand(['f', 'c'])
  .alias('f', 'file')
  .describe('f', 'Path to a Geonames postal codes file, e.g. /tmp/US.txt')
  .alias('c', 'config')
  .describe('c', 'Path to a Javascript configuration file, e.g. /tmp/local.config.js')
  .argv
;

// Initialize a connection to MongoDB:
var mongoPostal = require('../lib/mongo-postal');
console.log("Using MongoDB settings in configuration file: %s", argv.config);
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(argv.config, 'utf-8'));
var dbCollection = mongoPostal.initDb(config).collection(config.mongo.collection);

// Read the contents of the postal codes file and pass to our mongo postal db:
console.log("Reading postal codes from Geonames file: %s", argv.file);
mongoPostal.setUpIndexing(dbCollection);
var csv = require('csv');
csv()
.fromPath(argv.file, {
  delimiter : '\t',
  columns : [
    'country_code', 
    'postal_code', 
    'place_name', 
    'admin_name1', 
    'admin_code1', 
    'admin_name2', 
    'admin_code2', 
    'admin_name3', 
    'admin_code3', 
    'latitude', 
    'longitude', 
    'accuracy'
  ]
})
.transform(function(data, index) {
  return {
    country : data.country_code,
    zipcode : data.postal_code,
    city : data.place_name,
    state_long : data.admin_name1,
    state_short : data.admin_code1,
    // Convert the provided longitude and latitude properties into a mono loc object
    // (http://www.mongodb.org/display/DOCS/Geospatial+Indexing)
    loc : [
      parseFloat(data.longitude),
      parseFloat(data.latitude)
    ]
  };  
})
.on('data', function(data, index) {
  mongoPostal.savePostalCode(dbCollection, data);
})
.on('end', function(count) {
  console.log('Number of postal codes: '+count);
  process.exit();
})
.on('error', function(error) {
  console.error(error.message);
});
