G = require('cloud/global.js')
module.exports = function(app) {
  app.get('/elections/:year/presidential/vote/candidate', function(req, res) {
    Parse.Analytics.track('req', {
      path: req.path
    });
    Parse.Analytics.track('query', {
      year: req.params.year,
      election_type: "presidential",
      datatype: "candidate"
    });
    var Election = Parse.Object.extend("Election");
    var query = new Parse.Query(Election);
    query.equalTo("type", "presidential");
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
            "candidateVotes": results[0].get("candidateVotes"),
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