import { Message, TextChannel } from "discord.js";
import CommandHandler from "../../classes/CommandHandler";
import NsfwjsHandler from "../../classes/NsfwjsHandler.test";
import MeeS from "../../structures/Client";
import Event from "../../structures/Event";

export default class MessageCreate extends Event {
    constructor(client: MeeS) {
        super(client, 'messageCreate');
    }

    async run(message: Message) {
        if (message.author.bot || message.channel.type == "DM") return;
        try {
            await CommandHandler.handleCommand(this.client, message);
            await NsfwjsHandler.nsfwHandler(message, this.client);
            // this.client.executeCommand(message);
        } catch (err: any) {
            console.log(err.stack);
        }
    }
}