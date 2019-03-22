var axios = require("axios");

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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
