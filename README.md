# mongo-postal

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

<pre><code>
node test/load-geonames.js --file ~/data/geonames/US/US.txt --config ./local.config.js
</code></pre>

## Querying Postal Codes by Source Zipcode and Radius

### Command-Line

This test searches for the 10 closest postal objects within a 4 mile radius of zipcode 94133:

<pre><code>
node test/test-find-query.js -c ./local.config.js -z 94133 -r 1
Using MongoDB settings in configuration file: ./local.config.js
Found: {"country":"US","zipcode":"94133","city":"San Francisco","state_long":"California","state_short":"CA","loc":[-122.4091,37.8002],"_id":"50061415305f380000001160"}
Found: {"country":"US","zipcode":"94108","city":"San Francisco","state_long":"California","state_short":"CA","loc":[-122.4079,37.7929],"_id":"50061415305f380000001149"}
Found: {"country":"US","zipcode":"94111","city":"San Francisco","state_long":"California","state_short":"CA","loc":[-122.4001,37.7974],"_id":"50061415305f38000000114c"}
Found: {"country":"US","zipcode":"94104","city":"San Francisco","state_long":"California","state_short":"CA","loc":[-122.4018,37.7915],"_id":"50061415305f380000001145"}
Found: {"country":"US","zipcode":"94109","city":"San Francisco","state_long":"California","state_short":"CA","loc":[-122.4186,37.7917],"_id":"50061415305f38000000114a"}
Found 5 postals
</code></pre>

### Node.js API
todo

## NPM Dependencies

* mongoskin
* optimist (for test/load-geonames.js only)
* csv (for test/load-geonames.js only)

## NPM Usage

<pre><code>
npm install mongo-postal
</code></pre>