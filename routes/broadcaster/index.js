var express = require("express");
var router = express.Router();
const {minBroadcast, findMostConnected, findShortestPath} = require('./functions')

router.get('/',(req,res)=>{
  res.send({text:'hello'})
})

router.post("/message-broadcast", function(req, res, next) {
  // console.log()
  const formData = req.body
  res.send(minBroadcast(formData))
});
router.post("/most-connected-node", function(req, res, next) {
  // console.log()
  const formData = req.body
  res.send(findMostConnected(formData))
});
router.post("/fastest-path", function(req, res, next) {
  // console.log()
  const formData = req.body
  res.send(findShortestPath(formData))
});

module.exports = router