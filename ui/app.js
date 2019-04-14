const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");

const childprocess = require("child_process");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "abcdefg",
    resave: false,
    saveUninitialized: true
}));


// Log in a session.
var loggedInSessions = {};
app.post("/login-session", function(req, res) {
    var users = require("./users.json");
    if (users[req.body.user] != null) {
        bcrypt.compare(req.body.pwd, users[req.body.user], function(err, result) {
            if (err) return;
            if (result) {
                loggedInSessions[req.sessionID] = true;
                //res.send("true");
                res.redirect("/");
            }// else res.send("false");
            else res.redirect("/");
        });
    }// else res.send("false");
    else res.redirect("/");
});

app.get("/", function(req, res) {
    if (loggedInSessions[req.sessionID] === true) {
        // LOGGED IN
        res.render("index", {
            title: "CellBot",
        });
    } else {
        // NOT LOGGED IN
        res.render("login", {

        });
    }
});

// Handle bot process.
var running = false;
var runlog = "";
var botprocess;
app.get("/bot/start", function(req, res) {
    runlog = "";
    botprocess = childprocess.fork("bot.js", { silent: true });
    running = true;
    var invoked = false;
    botprocess.on("error", function (err) {
        if (invoked) return;
        invoked = true;
        console.log(err);
        running = false;
    });
    botprocess.on("exit", function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error("exit code " + code);
        console.log(err);
        running = false;
    });
    botprocess.stdout.on("data", function (data) {
        runlog += data;
    });
    res.send("1");
});
app.get("/bot/stop", function(req, res) {
    botprocess.kill();
    runlog = "";
    res.send("1");
});
app.get("/bot/runlog", function(req, res) {
    res.send(runlog);
});
app.get("/bot/running", function(req, res) {
    res.send(running.toString());
});


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.set("port", process.env.PORT || 3000);
var server = app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + server.address().port);
});