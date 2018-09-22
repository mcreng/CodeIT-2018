import { Router } from "express";
var router = Router();

// Generate all array subsets:
function* subsets(array, offset = 0) {
  while (offset < array.length) {
    let first = array[offset++];
    for (let subset of subsets(array, offset)) {
      subset.push(first);
      yield subset;
    }
  }
  yield [];
}

router.post("/", function(req, res, next) {
  var n = req.body["number_of_types_of_food"];
  var A = req.body["calories_for_each_type_for_raphael"];
  var B = req.body["calories_for_each_type_for_leonardo"];
  var delta = req.body["maximum_difference_for_calories"];

  var PA = subsets(A);
  var counter = 0;
  for (var pa of PA) {
    var PB = subsets(B);
    for (var pb of PB) {
      Math.abs(pa.reduce((a, b) => a + b, 0) - pb.reduce((a, b) => a + b, 0)) <=
      delta
        ? counter++
        : null;
    }
  }

  res.send({ result: counter });
});

export default router;
