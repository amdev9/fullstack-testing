const config = require("config");
const { MongoClient } = require("mongodb");

const mongoUrl = config.get("mongoUrl");
const dbName = config.get("dbName");
const collName = config.get("collName");
const descriptionTemplate = (fieldName) => `'${fieldName}' must be a string and is required`

const validatorObj = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Tracks Object Validation",
      required: ["event", "url", "title", "ts", "tags"],
      properties: {
        event: {
          bsonType: "string",
          description: descriptionTemplate("event")
        },
        tags: {
          bsonType: ["array"],
          description: descriptionTemplate("tags")
        },
        url: {
          bsonType: "string",
          description: descriptionTemplate("url")
        },
        title: {
          bsonType: "string",
          description: descriptionTemplate("title")
        },
        ts: {
          bsonType: "string",
          description: descriptionTemplate("ts")
        },
      },
    },
  },
  validationAction: "error",
};

const client = new MongoClient(mongoUrl);

async function initMongo() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  const collection = await client
    .db(dbName)
    .listCollections({}, { nameOnly: true })
    .toArray();

  if (
    collection.filter((collectionItem) => collectionItem.name === collName)
      .length
  ) {
    return db;
  } else {
    await db.createCollection(collName, validatorObj);
    return db;
  }
}

module.exports = initMongo;
