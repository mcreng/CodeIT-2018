import { Router } from "express";
import exif from "jpeg-exif";
import axios from "axios";
import fs from "fs";
import request from "request";
var router = Router();

var download = async function(uri, filename, callback) {
  request.head(uri, async function(err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", callback);
  });
};

router.post("/", async function(req, res, next) {
  var input = req.body;
  var output = [];

  const For = async () =>
    new Promise(async (resolve, reject) => {
      for (var i = 0; i < input.length; i++) {
        var file = input[i]["path"];
        await download(
          file,
          "./tmp.jpg",
          async () =>
            new Promise((resolve, reject) => {
              var data = exif.parseSync("./tmp.jpg");
              var gps = data["GPSInfo"];
              var lat = gps["GPSLatitude"][0];
              var lon = gps["GPSLongitude"][0];
              output.push({ lat: lat, long: lon });
            })
        );
      }
      resolve();
    });
  await For();
  console.log(output);
  res.send(output);
});

export default router;
