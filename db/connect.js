const mongoose = require("mongoose");
const connectDb = (MONGO_URL) => {
  return mongoose
    .connect(MONGO_URL)
    .then(async () => {
      console.log("connected to mongodb");
    })
    .catch((e) => console.error(e));
};

module.exports = connectDb;
