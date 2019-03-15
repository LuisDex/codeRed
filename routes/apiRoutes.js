var db = require("../models");
var axios = require("axios");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Grabbing youtube search results
  app.get("/youtube", function(req, res) {
    if (!req.body || !req.body.search) return res.status(404).end();
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet";
    url += "&maxResults=5";
    url += "&q=" + req.body.search.replace(" ","+");
    // Making sure the search is code related
    if (req.body.search.toLowerCase().indexOf("coding") === -1) url += "+coding";

    url += "&key=" + process.env.YOUTUBE_API_KEY;
    axios.get(url)
    .then(function(resp) {
      res.json(resp.data);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }); 

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
