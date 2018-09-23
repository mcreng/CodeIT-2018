require("babel-register");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var square = require("./routes/square").default;
var ml_q1 = require("./routes/machine-learning/question-1").default;
var ml_q2 = require("./routes/machine-learning/question-2").default;
var prime_sum = require("./routes/prime-sum").default;
var tally_expense = require("./routes/tally-expense").default;
var imagesGPS = require("./routes/imagesGPS").default;
var skilltree = require("./routes/skills/skills");
var air_traffic = require("./routes/air-traffic").default;
var cus_and_hotel = require("./routes/customers-and-hotel");
var dino = require("./routes/dino").default;

var index = require("./routes/index");
var users = require("./routes/users");

const puzzleSolver = require("./routes/sorting-game/puzzle-solver");
const GameManager = require('./routes/tetris/game_manager')

const {
  minBroadcast,
  findMostConnected,
  findShortestPath
} = require("./routes/broadcaster/functions");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/square", square);
app.use("/prime-sum", prime_sum);
app.use("/tally-expense", tally_expense);
app.use("/machine-learning/question-1", ml_q1);
app.use("/machine-learning/question-2", ml_q2);
app.use("/imagesGPS", imagesGPS);
app.use("/airtrafficcontroller", air_traffic);
app.use("/customers-and-hotel/", cus_and_hotel);
app.use("/two-dinosaurs", dino);

app.post("/broadcaster/message-broadcast", function(req, res, next) {
  const formData = req.body;
  console.log("bc t1", formData);
  const result = minBroadcast(formData);
  console.log("bc t1", { formData, result });
  res.send({ result });
});
app.post("/broadcaster/most-connected-node", function(req, res, next) {
  // console.log()
  const formData = req.body;
  console.log("bc t2", formData);
  const result = findMostConnected(formData);
  console.log("bc t2", { formData, result });
  res.send({ result });
});
app.post("/broadcaster/fastest-path", function(req, res, next) {
  // console.log()
  const formData = req.body;
  console.log("bc t3", formData);
  const result = findShortestPath(formData);
  console.log("bc t3", { formData, result });
  res.send({ result });
});

app.post("/sorting-game", (req, res, next) => {
  const formData = req.body;
  console.log("sorting game");
  res.send({ result: puzzleSolver(formData) });
});

app.post("/skill-tree", (req, res, next) => {
  const formData = req.body;
  console.log("skill-tree", formData);
  const result = skilltree(formData);
  console.log("skill tree", { formData, result });
  res.send(result);
});

app.post("/tetris", (req, res, next) => {
  const formData = req.body;
  console.log("tetris form", formData);
  const actions = GameManager(formData);
  console.log("tetris result", actions);
  res.send({actions});
});

// catch 404 and forward to error handler`
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
