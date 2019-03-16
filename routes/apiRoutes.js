var db = require("../models");
var axios = require("axios");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/video", function(req,res){

   var embedID = req.query;
   console.log(embedID);
   res.render("video",embedID)
  });

  app.get("/reddit", function(req, res){
    if (!req.query || !req.query.search) return res.status(404).end();
    var queryURL = "http://www.reddit.com/r/coding/search.json";
    axios({
        url: queryURL,
        method: "GET",
        data: {
            q: req.query.search,
            restrict_sr: "true"
        }
      }).then(function(response) {
          var children = response.data.children;
          
          res.json({items: children});
      });
  });


  // Grabbing youtube search results
  app.get("/youtube", function(req, res) {
    if (!req.query || !req.query.search) return res.status(404).end();
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet";
    url += "&maxResults=8";
    url += "&q=" + req.query.search.replace(" ","+");

    // Making sure the search is code related
    if (req.query.search.toLowerCase().indexOf("coding") === -1) url += "+coding";

    url += "&key=AIzaSyDru7LuP-KoZeYSJjNssMn-Jmf2cKODnMw";
    axios.get(url)
    .then(function(resp) {
      var items = resp.data.items;
      res.render("youtube", {
        items : items
      })
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }); 

  app.post("/api/user", function(req, res) {
    if (!req.body.username || req.body.username.length < 5) {
      return res.json({"error": "Username should be at least 5 characters long"});
    };
    if (!req.body.password || req.body.password.length < 8) {
      return res.json({"error": "Password should be at least 8 characters long"});
    };
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt).then(function(hash) {
          // Store hash in your password DB.
          var userInfo = {
            username: req.body.username,
            password: hash
          }
          db.User.create(userInfo).then(function(data) {
            res.json(data);
          }).catch(function(err) {
            console.log("Sequelize Error Occurred: " + err);
          });
      }).catch(function(err) {
        console.log("Hash Error Occurred: " + err);
      });;
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

