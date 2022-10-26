const express = require("express");
const path = require("path");
const cors = require("cors");
const config = require("config");

const initMongo = require("./initMongo");

const app = express();
const tracker = express();
const appPort = config.get("appPort");
const collName = config.get("collName");
const trackerPort = config.get("trackerPort");

app.get(["/", "/1.html", "/2.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/index.html"));
});

app.listen(appPort, () => {
  console.log(`Example app listening on port ${appPort}`);
});

tracker.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/tracker.js"));
});

tracker.use(cors());
tracker.use(express.json());

initMongo()
  .then((db) => {
    tracker.post("/track", async (req, res) => {
      const data = req.body;
      try {

        db.collection(collName).insertMany(data);
        res.sendStatus(200);
      } catch (e) {
        console.error("Error db insert ", JSON.stringify(e));
      }
    });

    tracker.listen(trackerPort, () => {
      console.log(`Example app listening on port ${trackerPort}`);
    });
  })
  .catch((e) => {
    console.error("Error initializing db", e);
  });
