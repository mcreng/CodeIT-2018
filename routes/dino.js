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
  for (var i = 1; i <= n; i++) {
    for (var k = -amax; k < amax; k++) {
      var sum =
        data[[i - 1, k - A[i - 1]]] +
        data[[i - 1, k + B[i - 1]]] +
        data[[i - 1, k - A[i - 1] + B[i - 1]]] +
        data[[i - 1, k]];
      data[[i, k]] = sum ? sum : 0;
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
  for (var i = -delta; i <= delta; i++) {
    counter += data[[n, i]];
  }

  res.send({ result: counter });
});

export default router;
