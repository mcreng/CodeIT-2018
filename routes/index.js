var express = require("express");
var router = express.Router();
// var firebase = require("firebase");
var request = require("request");
// var config = {
//   apiKey: "AIzaSyBHm_hsygQkndw8iKTP7avncEonkJdW4AQ",
//   authDomain: "submission-track.firebaseapp.com",
//   databaseURL: "https://submission-track.firebaseio.com",
//   projectId: "submission-track",
//   storageBucket: "submission-track.appspot.com",
//   messagingSenderId: "915238216610"
// };

const SUBMIT_URL = "http://cis2018-coordinator-demo.herokuapp.com/api/evaluate/";
const SUBMIT_VIEW = "http://cis2018-coordinator-demo.herokuapp.com/api/evaluation-run/";

// firebase.initializeApp(config);
// var db = firebase.database();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "badger-network" });
});

var submitStatuses = {};
// db.ref("/submits").once("data", data => {
//   submitStatuses = data.val();
// });
router.get("/submit", (req,res) => {
  request.post(
    {
      url: SUBMIT_URL,
      form: {
        team: "Badger Network",
        challenge: "CalculateSquare"
      }
    },
    (err, resp, body) => {
      res.send(body)
      console.log('submited: ',body)
      submitStatuses[body] = {state: 'waiting'}
    }
  );
});

let check = key => {
  console.log('check: ',key)
  request({
    url:SUBMIT_VIEW+key
  },(err,res,body)=>{
    if(body.status == 'COMPLETED'){
      submitStatuses[key] = body
      submitStatuses[key].state = 'COMPLETED'

    }
  })
}

let batchId = 0
setInterval(()=>{
  Object.keys(submitStatuses).length && check(Object.keys(submitStatuses).filter(k=>submitStatuses[k].state=='waiting')[0])
},1000)

module.exports = router;
