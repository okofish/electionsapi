G = require('cloud/global.js')
module.exports = function(req,res) {
  Parse.Analytics.track('req', {
    path: req.path
  });
  Parse.Analytics.track('query', {
    year: req.params.year,
    election_type: "presidential",
    data_type: "state",
    state_data_type: "electoral"
  });
  var Election = Parse.Object.extend("Election");
  var query = new Parse.Query(Election);
  query.equalTo("type", "presidential");
  query.equalTo("year", req.params.year);
  query.find({
    success: function(results) {
      if (results.length === 0 || !results[0].get("stateVote")) {
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
          "states": G._.map(results[0].get("stateVote"), function(state) {
            return G._.omit(state, 'popularVote')
          }),
          "url": req.path
        })
      }
    },
    error: function(error) {
      console.error("Error: " + error.code + " " + error.message);
    }
  });
};
