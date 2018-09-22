import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
import { spawn } from "child_process";
var router = Router();

router.post("/", function(req, res, next) {
  var question = req.body["question"];

  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/machine-learning/",
    args: [JSON.stringify(question)]
  }; // get print results in real-time

  PythonShell.run("question-2.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send({ answer: JSON.parse(results) });
  });
});

export default router;
