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

  var SA = [...subsets(A)]
    .map(v => v.reduce((a, b) => a + b, 0))
    .sort((a, b) => a - b);
  var SB = [...subsets(B)]
    .map(v => v.reduce((a, b) => a + b, 0))
    .sort((a, b) => a - b);
  console.log(SA, SB);
  var counter = 0;
  for (var i = 0; i < SB.length; i++) {
    var j = 0;
    for (; j < SA.length; j++) {
      if (SA[j] - SB[i] > delta) {
        console.log(SA.length - j);
        counter += SA.length - j;
        break;
      }
    }
  }
  for (var i = SB.length - 1; i >= 0; i--) {
    var j = SA.length - 1;
    for (; j >= 0; j--) {
      if (SB[i] - SA[j] > delta) {
        console.log(j + 1);
        counter += j + 1;
        break;
      }
    }
  }
  console.log(counter);

  res.send({ result: SA.length * SB.length - counter });
});

export default router;
