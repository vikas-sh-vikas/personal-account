import mongoose from "mongoose";
import { connected } from "process";

import React from "react";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDb Connected Successfully");
    });
    connection.on("error", (err) => {
      console.log("mongodb connection error" + err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
