import { Router } from "express";
import exif from "jpeg-exif";
import axios from "axios";
import fs from "fs";
import request from "request";
var router = Router();

var download = async (uri, filename, callback) => new Promise((resolve,reject)=>{
  request.head(uri, async function(err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", ()=>{
        callback()
        resolve()
      });
  })
});

var downloadAll = async function(input){
  var output = [];

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
          console.log(output);
        })
    );
  }
  console.log('gg')
  return output
}

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

router.post("/", asyncMiddleware(async function(req, res, next) {
  var input = req.body;
  var output = []
  try{
    output = await downloadAll(input)
  }catch(e){
    console.log(e)
  }

  console.log('hi')

  res.send(output);
}));

export default router;
