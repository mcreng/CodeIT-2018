import { Router } from "express";
import _ from "lodash";
require("sanic.js").changeMyWorld();
var router = Router();

var data = {};
var n = 0;
var A = null;
var B = null;

// var elapsed_time = function(note) {
//   var precision = 3; // 3 decimal places
//   var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
//   console.log(
//     process.hrtime(start)[0] +
//       " s, " +
//       elapsed.toFixed(precision) +
//       " ms - " +
//       note
//   ); // print message + time
//   start = process.hrtime(); // reset the timer
// };

// var start = process.hrtime();

function new_loop() {
  var new_nonzero = [0];
  for (var i = 1; i <= n; i++) {
    var prevData = data;
    data = {};
    var nonzero = new_nonzero,
      new_nonzero = [];
    nonzero = _.uniq(nonzero);
    // elapsed_time([i, nonzero.length]);

    for (var kk of nonzero) {
      for (var k of [
        kk,
        kk + A[i - 1],
        kk - B[i - 1],
        kk + A[i - 1] - B[i - 1]
      ]) {
        var sum1 = prevData[k - A[i - 1]];
        var sum2 = prevData[k + B[i - 1]];
        var sum3 = prevData[k - A[i - 1] + B[i - 1]];
        var sum4 = prevData[k];

        var sum =
          (sum1 ? sum1 : 0) +
          (sum2 ? sum2 : 0) +
          (sum3 ? sum3 : 0) +
          (sum4 ? sum4 : 0);
        data[k] = sum ? sum : 0;
        if (data[k] !== 0) new_nonzero.push(k);
      }
    }
  }
}

router.post("/", function(req, res, next) {
  data = { 0: 1 };
  // console.log(req.body);
  n = req.body["number_of_types_of_food"];
  A = req.body["calories_for_each_type_for_raphael"];
  B = req.body["calories_for_each_type_for_leonardo"];
  var delta = req.body["maximum_difference_for_calories"];
  new_loop();
  var counter = 0;

  Object.keys(data).forEach(k => {
    if (Math.abs(k) <= delta) {
      counter += data[k];
      counter %= 100000123;
    }
  });

  res.send({ result: counter });
});

export default router;
