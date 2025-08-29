const mongoose = require("mongoose");
require("dotenv").config();
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI,{
      useNewUrlParser: true,
    })//if promise if fullfield then data will come here 
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.port}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
