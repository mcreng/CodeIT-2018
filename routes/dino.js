import { Router } from "express";
var router = Router();

var data = {};
var n = 0;
var A = null;
var B = null;
function loop() {
  data[[0, 0]] = 1;

  var new_nonzero = [0];
  for (var i = 1; i <= n; i++) {
    var nonzero = new_nonzero,
      new_nonzero = [];

    nonzero.forEach(kk => {
      var kl = [kk, kk + A[i - 1], kk - B[i - 1], kk + A[i - 1] - B[i - 1]];
      kl.forEach(k => {
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
        if (data[[i, k]] !== 0) new_nonzero.push(k);
      });
    });

    Object.keys(data).forEach(key => {
      key = JSON.parse("[" + key + "]");
      if (key[0] == i - 1) delete data[key];
    });
  }
}

router.post("/", function(req, res, next) {
  data = {};
  console.log(req.body);
  n = req.body["number_of_types_of_food"];
  A = req.body["calories_for_each_type_for_raphael"];
  B = req.body["calories_for_each_type_for_leonardo"];
  var delta = req.body["maximum_difference_for_calories"];
  loop();
  var counter = 0;

  Object.keys(data).forEach(k => {
    k = JSON.parse("[" + k + "]");
    if (Math.abs(k[1]) <= delta) {
      counter += data[k];
    }
  });

  res.send({ result: counter });
});

export default router;
