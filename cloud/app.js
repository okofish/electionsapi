// These two lines are required to initialize Express in Cloud Code.
express = require('express');
app = express();

_ = require('underscore');

function dropMetaKeys(obj) {
  return _.omit(obj, ["createdAt", "updatedAt", "objectId"])
}

function dropMetaKeysL2(obj) {
  return _.map(obj, function(l2obj) {
    return dropMetaKeys(l2obj)
  })
}

// Global app configuration section
app.set('views', 'cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine
app.use(express.bodyParser()); // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/elections/:year/:election', function(req, res) {
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.equalTo("type", req.params.election);
  query.equalTo("year", req.params.year);
  query.find({
    success: function(results) {
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "totalVotes": results[0].get("totalVotes"),
        "votingAge": results[0].get("votingAge")
      })
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
});

app.get('/elections/:year/:election/data/popularvote', function(req, res) {
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.equalTo("type", req.params.election);
  query.equalTo("year", req.params.year);
  query.find({
    success: function(results) {
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "popularVote": results[0].get("popularVote")
      })
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
});

app.get('/elections/:year/:election/data/electoralstatevote', function(req, res) {
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.equalTo("type", req.params.election);
  query.equalTo("year", req.params.year);
  query.find({
    success: function(results) {
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "electoralStateVote": results[0].get("electoralStateVote")
      })
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
});

app.get('/', function(req, res) {
  res.send({
    "elections_url": "/elections"
  })
})

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
