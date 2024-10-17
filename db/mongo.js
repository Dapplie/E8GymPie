const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://boughosnjuliano:Mongo@10@e8gymcluster.5djqx19.mongodb.net/?retryWrites=true&w=majority&appName=E8GymCluster";

async function connect() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

module.exports = connect;
