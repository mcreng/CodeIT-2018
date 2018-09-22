import { Router } from "express";
import axios from "axios";
import moment from "moment";
import fs from "fs";
var router = Router();

function getTimeDiff(a, b) {
  var d1 = moment(a, "HHmm");
  var d2 = moment(b, "HHmm");
  return d2.diff(d1, "seconds");
}

function addTime(a, diff) {
  var d1 = moment(a, "HHmm");
  d1.add(diff, "seconds");
  return d1.format("HHmm");
}

router.post("/", async function(req, res, next) {
  console.log(req.body);
  var flights = req.body["Flights"];
  var statics = req.body["Static"];

  flights.sort(function(a, b) {
    var keyA = a["Time"];
    var keyB = b["Time"];
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  if (statics["Runways"]) {
    var runways = statics["Runways"];
    var runway_status = [];
    runways.forEach(() => runway_status.push("0000"));
    flights[0]["Runway"] = runways[0]; // choose first one
    runway_status[0] = addTime(flights[0]["Time"], statics["ReserveTime"]);

    for (var i = 1; i < flights.length; i++) {
      var j = 0;

      var s = runway_status.sort(function(a, b) {
        var keyA = a["Time"];
        var keyB = b["Time"];
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      var min_s = Math.min(...s);
      min_s = min_s.toString();
      min_s = "0".repeat(4 - min_s.length).concat(min_s);
      j = s.indexOf(min_s);
      console.log(j);

      flights[i]["Runway"] = runways[j];

      if (getTimeDiff(runway_status[j], flights[i]["Time"]) < 0) {
        flights[i]["Time"] = runway_status[j];
      }
      runway_status[j] = addTime(flights[i]["Time"], statics["ReserveTime"]);
    }
  } else {
    for (var i = 1; i < flights.length; i++) {
      if (
        getTimeDiff(flights[i - 1]["Time"], flights[i]["Time"]) <
        statics["ReserveTime"]
      ) {
        flights[i]["Time"] = addTime(
          flights[i - 1]["Time"],
          statics["ReserveTime"]
        );
      }
    }
  }

  res.send(flights);
});

export default router;
