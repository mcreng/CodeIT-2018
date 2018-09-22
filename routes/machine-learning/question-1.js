import { Router } from "express";
import axios from "axios";
var router = Router();

router.post("/", function(req, res, next) {
  var input = req.body["input"];
  var output = req.body["output"];
  var question = req.body["question"];
  res.send(JSON.stringify(parseInt(input) * parseInt(input)));
});

export default router;
