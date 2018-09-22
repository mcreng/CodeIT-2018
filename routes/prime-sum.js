import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
var router = Router();

router.post("/", function(req, res, next) {
  console.log(req.body);
  var input = req.body["input"];

  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/",
    args: [parseInt(input)]
  }; // get print results in real-time

  PythonShell.run("primeSum.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send(results);
  });
});

export default router;
