const config = require("config");
const { MongoClient } = require("mongodb");

const mongoUrl = config.get("mongoUrl");
const dbName = config.get("dbName");
const collName = config.get("collName");

const validatorObj = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Tracks Object Validation",
      required: ["event", "url", "title", "ts", "tags"],
      properties: {
        event: {
          bsonType: "string",
          description: "'event' must be a string and is required",
        },
        tags: {
          bsonType: ["array"],
          description: "'tags' must be an array and is required",
        },
        url: {
          bsonType: "string",
          description: "'url' must be a string and is required",
        },
        title: {
          bsonType: "string",
          description: "'title' must be a string and is required",
        },
        ts: {
          bsonType: "string",
          description: "'ts' must be a string and is required",
        },
      },
    },
  },
};

const client = new MongoClient(mongoUrl);

async function initMongo() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  if (db.collection(collName)) {
    return db.collection(collName);
  } else {
    // create collection with schema validation
    return db.createCollection(collName, validatorObj);
  }
}

module.exports = initMongo;
