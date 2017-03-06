
'use strict';

const redis = require('redis');
const http = require('http');
const nconf = require('nconf');
//var $ = require('jquery');

// read in keys and secrets. You can store these in a variety of ways.
// I like to use a keys.json file that is in the .gitignore file,
// but you can also store them in environment variables
nconf.argv().env().file('keys.json');

// [START client]
// Connect to a redis server provisioned over at
// Redis Labs. See the README for more info.
const client = redis.createClient(
  nconf.get('redisPort') || '6379',
  nconf.get('redisHost') || '127.0.0.1',
  {
    'auth_pass': nconf.get('redisKey'),
    'return_buffers': true
  }
).on('error', (err) => console.error('ERR:REDIS:', err));
// [END client]

// Create a simple little server.
http.createServer((req, res) => {
  client.on('error', (err) => console.log('Error', err));

  // Track the products
  const listName = 'products';

  // List all the products
  let plist = '';
  client.zrange(listName, 0, -1, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
      return;
    }

    data.forEach((p) => {
      plist += `${p}; `;
    });

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end(plist);
    //res.end(body);
    console.log("Server creation complete");
  });
}).listen(process.env.PORT || 8080);

console.log('started web process');

/*
var jsdom = require('jsdom').jsdom
    , myWindow = jsdom().defaultView
    , $ = require('jquery')(myWindow);

$("<H1>Autocomplete Prototype</h1>").appendTo("body");
$("<input id='autocomplete' title='type &quot;a&quot;'>").appendTo("body");

var body =
        "<H1>Autocomplete Prototype</h1>" +
        "<input id='autocomplete' title='type &quot;a&quot;'>"
  */      
