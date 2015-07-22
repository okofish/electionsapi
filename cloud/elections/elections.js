G = require('cloud/global.js')
module.exports = function(app) {
  app.get('/elections', function(req, res) {
    Parse.Analytics.track('req', {
      path: req.path
    });
    var Election = Parse.Object.extend("Election");
    var query = new Parse.Query(Election);
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
        }
      },
      error: function(error) {
        console.error("Error: " + error.code + " " + error.message);
      }
    });
  })
};