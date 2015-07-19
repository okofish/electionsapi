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

app.get('/elections/:year/:election', function(req, res) {
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.equalTo("type", req.params.election);
  query.equalTo("year", req.params.year);
  query.find({
    success: function(results) {
      var dataTypes = [];
      _.map(["popularVote", "electoralStateVote"], function(dtype) {
        if (results[0].get(dtype) != undefined) {
          dataTypes.push(dtype.toLowerCase())
        }
      })
      res.type('json');
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "totalVotes": results[0].get("totalVotes"),
        "votingAge": results[0].get("votingAge"),
        "dataTypes": dataTypes,
        "url": req.path
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
      res.type('json');
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "popularVote": results[0].get("popularVote"),
        "url": req.path
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
      res.type('json');
      res.send({
        "year": results[0].get("year"),
        "type": results[0].get("type"),
        "electoralStateVote": results[0].get("electoralStateVote"),
        "url": req.path
      })
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
});

app.get('/elections', function(req, res) {
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.find({
    success: function(results) {
      var electionslist = [];
      for (election in results) {
        electionslist.push({
          "year": results[election].get("year"),
          "type": results[election].get("type")
        })
      }
      res.type('json');
      res.send({
        "elections": electionslist,
        "url": req.path
      })
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
})

app.get('/', function(req, res) {
  res.type('json');
  res.send({
    "elections_url": "/elections"
  })
})

app.use(function(req, res) {
  res.send({
    "error": {
      "code": 404,
      "message": 'Endpoint not found.'
    }
  });
});

// Attach the Express app to Cloud Code.
app.listen();
