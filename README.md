# node-mongo-postal

A node.js module that both creates a MongoDB collection of US postal codes and provides geo-spatial searching on them given a source zipcode and radius. Based on the Geonames database [www.geonames.org](http://www.geonames.org) which is licensed under a Creative Commons Attribution 3.0 License.

## License
Copyright (c) 2012 Chris Bumgardner and Misha Bosin

This content is released under the MIT License [here](https://github.com/cbumgard/node-mongo-postal/blob/master/LICENSE)

## Download Geonames Postal Codes for the US
[http://download.geonames.org/export/zip/US.zip](http://download.geonames.org/export/zip/US.zip)

## Configuration

I recommend creating a copy of config.js called local.config.js and adding it to your .gitignore so your MongoDB configuration settings do not get persisted in git.

## Loading Postal Codes into MongoDB from the Command-Line

Saves postal code documents in MongoDB using [geospatial indexes](http://www.mongodb.org/display/DOCS/Geospatial+Indexing).

Example (be sure to npm install the dependencies listed under "NPM Dependencies" first):

> node test/load-geonames.js --file ~/data/geonames/US/US.txt --config ~/code/node-mongo-postal/local.config.js

## Querying Postal Codes by Source Zipcode and Radius

### Command-Line
todo

### Node.js API
todo

## NPM Dependencies

* mongoskin
* optimist (load-geonames.js only)
* csv (load-geonames.js only)

## NPM Usage
todo