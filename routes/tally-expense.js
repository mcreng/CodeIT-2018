import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
var router = Router();

router.post("/", function(req, res, next) {
  var input = req.body;
  console.log(input)

  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/",
    args: [JSON.stringify(input)]
  }; // get print results in real-time

  PythonShell.run("tallyExpense.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send(results);
    console.log(JSON.parse(results))
  });
});

export default router;
