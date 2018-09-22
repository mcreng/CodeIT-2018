import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
import { spawn } from "child_process";
var router = Router();

router.post("/", function(req, res, next) {
  var input = req.body["input"];
  var output = req.body["output"];
  var question = req.body["question"];

  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/machine-learning/",
    args: [
      JSON.stringify(input),
      JSON.stringify(output),
      JSON.stringify(question)
    ]
  }; // get print results in real-time

  PythonShell.run("question-1.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send({ answer: results[0] });
    res.send(JSON.stringify(results[0]));
  });
});

export default router;
