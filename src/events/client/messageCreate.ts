import { Message } from "discord.js";
import CommandHandler from "../../classes/CommandHandler";
import MeeS from "../../structures/Client";
import Event from "../../structures/Event";

export default class MessageCreate extends Event {
    constructor(client: MeeS) {
        super(client, 'messageCreate');
    }

    async run(message: Message) {
        if (message.author.bot || message.channel.type == "DM") return;
        await CommandHandler.handleCommand(this.client, message);
        this.client.executeCommand(message);
    }
}