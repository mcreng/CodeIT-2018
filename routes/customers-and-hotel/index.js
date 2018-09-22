import { Router } from "express";
import { PythonShell } from "python-shell";
import axios from "axios";
import { spawn } from "child_process";
var router = Router();

router.post("/minimum-camps", function(req, res, next) {
  // console.log()
  const formData = req.body;
  console.log(formData)
  
  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/customers-and-hotel/",
    args: [formData]
  }; // get print results in real-time

  PythonShell.run("minimum-camps.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send({ answer: results });
  });
});
router.post("/minimum-distance", function(req, res, next) {
  // console.log()
  const formData = req.body;
  console.log(formData)
  
  var options = {
    mode: "text",
    pythonPath: "python",
    pythonOptions: ["-u"],
    scriptPath: "./routes/customers-and-hotel/",
    args: [formData]
  }; // get print results in real-time

  PythonShell.run("minimum-distance.py", options, function(err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log("results: %j", results);
    res.send({ answer: results });
  });
});

// export default router;
module.exports = router;
