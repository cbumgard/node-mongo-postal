exports.savePostalCode = function(db, postalCode) {
  console.log("Saving postal code: %s", JSON.stringify(postalCode));
  //todo save this postal code data, ensuring a geospatial index on the latitude/longitude pair
}

exports.findQuery = function(zipcode, radiusMiles) {
  //todo return a find query that can be passed into a mongo db collection
}