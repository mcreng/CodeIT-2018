var express = require("express");
var router = express.Router();
const {minBroadcast, findMostConnected, findShortestPath} = require('./functions')

router.get("/message-broadcast", function(req, res, next) {
  // console.log()
  res.render("index", { title: "task 1" });
});

module.exports = router