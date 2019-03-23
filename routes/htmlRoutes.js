var axios = require("axios");
var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index", {
      layout: "home"
    });
  });

  app.get("/register", function(req, res) {
    res.render("register", {
      layout: "home"
    });
  });

  app.get("/login", function(req, res) {
    res.render("login", {
      layout: "home"
    });
  });

  app.get("/video", function(req, res) {
    var embedID = req.query;
    console.log(embedID);
    res.render("video", embedID);
  });

  app.get("/editor", function(req, res) {
    res.render("editor");
  });

  app.get("/reddit", function(req, res){
    if (!req.query || !req.query.search) return res.status(404).end();
    var queryURL = "https://www.reddit.com/r/coding/search.json?q=" + req.query.search;
    axios({
        url: queryURL,
        method: "GET",
        data: {
  
            restrict_sr: "true"
        }
      }).then(function(response) {
          var children = response.data.data.children;

          if(children.length > 10)
          {
           children = children.slice(0,10);
          }
          res.render("reddit",{items:children});
      });
  });

  app.get("/stackoverflow", function(req, res) {
    if (!req.query || !req.query.search) return res.status(404).end();
    let url = "http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&site=stackoverflow&key=";
    url += "bbiQ0G37kJkUnY2bDcjyyQ((";
    url += "&q=" + req.query.search;
    axios.get(url)
    .then(function(resp) {
      var items = resp.data.items;
      res.render("stackoverflow", {
        items : items
      })
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }); 

  // Grabbing youtube search results
  app.get("/youtube", function(req, res) {
    if (!req.query || !req.query.search) return res.status(404).end();
    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet";
    url += "&maxResults=9";
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

  // Used for rendering users' profile pages
  app.get("/users/:id", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(data) {
      var user_info = {
        displayName: data.displayName,
        username: data.username,
        blurb: data.blurb,
        myAccount: (req.params.id == data.id)
      }
      res.render("user", {
        info: user_info
      });
    });
  });

  // Rendering a user's favorites
  app.get("/users/:id/favorites", function(req, res) {
    db.Favorite.findAll({ where: { UserId: req.params.id } }).then(function(data) {
      res.render("favorites", {
        items: data
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};