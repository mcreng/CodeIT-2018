import { Router } from "express";
var router = Router();

var data = {};
var n = 0;
var A = null;
var B = null;
var amax = 0;
function loop() {
  for (var k = -amax; k < amax; k++) {
    data[[0, k]] = 0;
  }
  data[[0, 0]] = 1;

  var new_nonzero = { 0: true };
  for (var i = 1; i <= n; i++) {
    var nonzero = new_nonzero,
      new_nonzero = {};
    for (var k = -amax; k < amax; k++) {
      if (
        nonzero[k] ||
        nonzero[k - A[i - 1]] ||
        nonzero[k + B[i - 1]] ||
        nonzero[k - A[i - 1] + B[i - 1]]
      ) {
        var sum1 = data[[i - 1, k - A[i - 1]]];
        var sum2 = data[[i - 1, k + B[i - 1]]];
        var sum3 = data[[i - 1, k - A[i - 1] + B[i - 1]]];
        var sum4 = data[[i - 1, k]];

        var sum =
          (sum1 ? sum1 : 0) +
          (sum2 ? sum2 : 0) +
          (sum3 ? sum3 : 0) +
          (sum4 ? sum4 : 0);
        data[[i, k]] = sum ? sum : 0;
        if (data[[i, k]] !== 0) new_nonzero[k] = true;
      }
    }
    for (var k = -amax; k < amax; k++) {
      delete data[[i - 1, k]];
    }
  }
}

router.post("/", function(req, res, next) {
  data = {};
  console.log(req.body);
  n = req.body["number_of_types_of_food"];
  A = req.body["calories_for_each_type_for_raphael"];
  B = req.body["calories_for_each_type_for_leonardo"];
  var delta = req.body["maximum_difference_for_calories"];
  amax = A.reduce((a, b) => a + b, 0) + B.reduce((a, b) => a + b, 0) + 1;
  loop();
  var counter = 0;
  console.log(data);
  for (var i = -delta; i <= delta; i++) {
    counter += data[[n, i]] ? data[[n, i]] : 0;
  }

  res.send({ result: counter });
});

export default router;
