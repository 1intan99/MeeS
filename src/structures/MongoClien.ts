import mongoose from "mongoose";
import Logger from "../classes/Logger";

export default class MongoDB {

    connect() {

        mongoose.connect(process.env.MongoClient as string)
        mongoose.connection
        .on("connected", () => {
            Logger.log("SUCCESS", "MongoDB Successfully Connected!");
        })
        .on("err", (err) => {
            Logger.log("ERROR", `MongoDB Connection Error: ${err.stack}`);
        })
        .on("disconnected", () => {
            Logger.log("WARNING", "MongoDB Disconnected!");
        });
    }
}