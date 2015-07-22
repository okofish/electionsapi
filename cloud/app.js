// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

G = require('cloud/global.js')

function dropMetaKeys(obj) {
  return G._.omit(obj, ["createdAt", "updatedAt", "objectId"])
}

function dropMetaKeysL2(obj) {
  return G._.map(obj, function(l2obj) {
    return dropMetaKeys(l2obj)
  })
}

// Global app configuration section
app.set('views', 'cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine
app.use(express.bodyParser()); // Middleware for reading request body



require('cloud/elections/elections.js')(app)
require('cloud/elections/election/election.js')(app)

require('cloud/elections/election/votes/candidate.js')(app)
require('cloud/elections/election/votes/state.js')(app)



app.get('/', function(req, res) {
  Parse.Analytics.track('req', {
    path: req.path
  });
  res.type('json');
  res.send({
    "electionsg._url": "/elections",
    "docs": "http://docs.electionsapi.apiary.io/"
  })
})

app.use(function(req, res) {
  Parse.Analytics.track('error', {
    type: '404',
    path: req.path
  });
  res.type('json');
  res.send({
    "error": {
      "code": 404,
      "message": 'Endpoint not found.'
    }
  });
});

// Attach the Express app to Cloud Code.
app.listen();
