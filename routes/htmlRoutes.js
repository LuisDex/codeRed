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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
