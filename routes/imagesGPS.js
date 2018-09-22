import { Router } from "express";
import exif from "jpeg-exif";
import axios from "axios";
import fs from "fs";
import request from "request";
var router = Router();

var download = async function(uri, filename, callback) {
  await request.head(uri, async function(err, res, body) {
    await request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", callback);
  });
};

router.post("/", async function(req, res, next) {
  var input = req.body;
  var output = [];

  for (var i = 0; i < input.length; i++) {
    var file = input[i]["path"];
    await download(file, "./tmp.jpg", () => {
      var data = exif.parseSync("./tmp.jpg");
      var gps = data["GPSInfo"];
      var lat = gps["GPSLatitude"][0];
      var lon = gps["GPSLongitude"][0];
      output.push({ lat: lat, lon: lon });
      console.log(output);
    });
  }

  console.log(13);
  res.send(output);
});

export default router;
