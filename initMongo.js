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
  validationAction: "error"
};

const client = new MongoClient(mongoUrl);

async function initMongo() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const collection = await client.db(dbName).listCollections({}, { nameOnly: true }).toArray()
  
  if (collection.filter(collectionItem => collectionItem.name === collName).length) {
    return db
  } else {
    await db.createCollection(collName, validatorObj);
    return db
  }
}

module.exports = initMongo;
