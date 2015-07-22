G = require('cloud/global.js')
module.exports = function(app) {
  app.get('/elections/:year/:election', function(req, res) {
    Parse.Analytics.track('req', {
      path: req.path
    });
    Parse.Analytics.track('query', {
      year: req.params.year,
      type: req.params.election
    });
    var Election = Parse.Object.extend("Election");
    var query = new Parse.Query(Election);
    query.equalTo("type", req.params.election);
    query.equalTo("year", req.params.year);
    query.find({
      success: function(results) {
        if (results.length === 0) {
          res.type('json');
          res.send({
            "error": {
              "code": 400,
              "message": 'Parameters not valid.'
            }
          });
        } else {
          var dataTypes = [];
          G._.map(["candidateVotes", "stateVote"], function(dtype) {
            if (results[0].get(dtype) != undefined) {
              switch (dtype) {
              case "stateVote":
                dataTypes.push("state")
                //dataTypes.push("popular")
                //dataTypes.push("electoral")
                break;
              case "candidateVotes":
                dataTypes.push("candidate")
                break;
              default:
                dataTypes.push(dtype.toLowerCase())
              }
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
        }
      },
      error: function(error) {
        console.error("Error: " + error.code + " " + error.message);
      }
    });
  });
};