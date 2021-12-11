import { model, Schema } from "mongoose";


const NsfwSchema: Schema = new Schema({
    guildId: String,
    channelId: { type: Array, default: [] }
}, { id: false });

export const nsfwModel = model("Nsfwjs", NsfwSchema);