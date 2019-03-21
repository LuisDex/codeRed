var db = require("../models");
var axios = require("axios");

module.exports = function(app, passport) {
  app.get("/video", function(req,res){

   var embedID = req.query;
   console.log(embedID);
   res.render("video",embedID)
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
    let url = "http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&key=";
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

  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    console.log(req);
    res.json("/");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log("Authentication Error Occurred: " + err);
      res.json(err);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      console.log(req.user);
      res.json({
        email: req.user.email,
        id: req.user.id,
        username: req.user.username
      });
    }
  });
};

