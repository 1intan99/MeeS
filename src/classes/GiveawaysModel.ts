import { GiveawaysManager } from "discord-giveaways";
import { giveawayModel } from "../model/giveaways";

export default class Giveaways extends GiveawaysManager {
    async getAllGiveawayss() {
        return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId?: string, giveawayData?: any) {
        await giveawayModel.create(giveawayData);
        return true;
    }

    async editGiveaway(messageId: string, giveawayData: any) {
        await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
        return true;
    }

    async deleteGiveaway(messageId: string) {
        await giveawayModel.deleteOne({ messageId }).exec();
        return true;
    }
}