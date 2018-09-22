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
  console.log(req.body);
  var n = req.body["number_of_types_of_food"];
  var A = req.body["calories_for_each_type_for_raphael"];
  var B = req.body["calories_for_each_type_for_leonardo"];
  var delta = req.body["maximum_difference_for_calories"];

  var SA = [...subsets(A)]
    .map(v => v.reduce((a, b) => a + b, 0))
    .sort((a, b) => a - b);
  var SB = [...subsets(B)]
    .map(v => v.reduce((a, b) => a + b, 0))
    .sort((a, b) => a - b);
  var counter = 0;
  var new_counter = 0;
  for (var i = 0; i < SB.length; i++) {
    var index = SA.findIndex(el => el - SB[i] > delta);
    if (index !== -1) {
      new_counter += SA.length - index;
    } else break;
  }
  for (var i = SB.length - 1; i >= 0; i--) {
    var index = SA.reverse().findIndex(el => SB[i] - el > delta);
    if (index !== -1) {
      new_counter += SA.length - index;
    } else break;
    SA.reverse();
  }

  res.send({ result: SA.length * SB.length - new_counter });
});

export default router;
