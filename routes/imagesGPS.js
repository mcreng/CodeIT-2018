import { Router } from "express";
import exif from "jpeg-exif";
import EXIF from "exif-js";
import axios from "axios";
import fs from "fs";
import request from "request";
var router = Router();

var download = async (uri, filename, callback) =>
  new Promise((resolve, reject) => {
    request.head(uri, async function(err, res, body) {
      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", resolve);
    });
  });

var toDecimal = function(number) {
  return number[0] + number[1] / 60 + number[2] / 3600;
};

var ExifImage = require("exif").ExifImage;
var exitLoad = async params =>
  new Promise((resolve, reject) => {
    new ExifImage(params, (...params) => {
      // console.log('exif load',params)
      resolve(params);
    });
  });
var downloadAll = async function(input) {
  var output = [];

  for (var i = 0; i < input.length; i++) {
    var file = input[i]["path"];
    const content = await download(file, "./tmp.jpg");
    const [error, exifData] = await exitLoad({ image: "./tmp.jpg" });
    // console.log({ error, exifData });
    if (error) console.log("Error: " + error.message);
    else {
      console.log(exifData.gps); // Do something with your data!
      // console.log(exifData.gps.GPSLatitude);
      // console.log(exifData.gps.GPSLongitude);
      var ns = exifData.gps.GPSLatitudeRef;
      var ew = exifData.gps.GPSLongitudeRef;
      var lat = toDecimal(exifData.gps.GPSLatitude); //gps["GPSLatitude"][0];
      var lon = toDecimal(exifData.gps.GPSLongitude); //gps["GPSLongitude"][0];
      if (ns == "S") lat = -lat;
      if (ew == "W") lon = -lon;
      // var lat_ = EXIF.getTag(data,'GPSLatitude')
      // var long_ = EXIF.getTag(data,'GPSLongitude')
      // console.log({ lat_, long_ });
      output.push({ lat: lat, long: lon });
      console.log(output);
    }
  }
  return output;
};

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/",
  asyncMiddleware(async function(req, res, next) {
    var input = req.body;
    var output = [];
    console.log(input);
    try {
      output = await downloadAll(input);
    } catch (e) {
      console.log(e);
    }

    res.send(output);
  })
);

export default router;
