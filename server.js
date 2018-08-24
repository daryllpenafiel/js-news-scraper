var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//models
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraped_articles";
// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine","handlebars");
app.use(express.static("public"));

//Routes
require("./routes/html-routes")(app);
// require("./routes/api-routes")(app);

//Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  