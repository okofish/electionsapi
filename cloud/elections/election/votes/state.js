G = require('cloud/global.js')
module.exports = function(app) {
  app.get('/elections/:year/:election/vote/state', function(req, res) {
    if (req.query.state_data_type == "popular") {
      require('cloud/elections/election/votes/states/popular.js')(req,res)
    } else if (req.query.state_data_type == "electoral") {
      require('cloud/elections/election/votes/states/electoral.js')(req,res)
    } else {
      Parse.Analytics.track('req', {
        path: req.path
      });
      Parse.Analytics.track('query', {
        year: req.params.year,
        type: req.params.election,
        datatype: "popular"
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
            res.type('json');
            res.send({
              "year": results[0].get("year"),
              "type": results[0].get("type"),
              "states": results[0].get("stateVote"),
              "url": req.path
            })
          }
        },
        error: function(error) {
          console.error("Error: " + error.code + " " + error.message);
        }
      });
    }
  });
};

