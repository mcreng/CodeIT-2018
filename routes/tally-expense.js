import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
import util from "util";
var router = Router();

router.post("/", function(req, res, next) {
  var input = req.body;
  console.log(util.inspect(input,false,null,true ))

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
    res.send(JSON.parse(results));
    console.log(util.inspect(JSON.parse(results),false,null,true ))
  });
});

export default router;
