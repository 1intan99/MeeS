import { Message, TextChannel } from "discord.js";
import CommandHandler from "../../classes/CommandHandler";
import MeeS from "../../structures/Client";
import Event from "../../structures/Event";
import getUrls from "get-urls";
import { max } from "lodash";

export default class MessageCreate extends Event {
    constructor(client: MeeS) {
        super(client, 'messageCreate');
    }

    async run(message: Message) {
        if ((message.channel as TextChannel).nsfw) return;
        if (message.author.bot || message.channel.type == "DM") return;
        await CommandHandler.handleCommand(this.client, message);
        this.client.executeCommand(message);

        const attachment = message.attachments.first()?.url

        if (message.attachments.size > 0) {
            message.attachments.forEach(async (x) => {
                if (checkURL(x.url)) {
                    await this.client.nsfwjs.classify(x.url, message);
                }
            })
        }

        

        // getUrls(message.cleanContent).forEach(async (url) => {
        //     console.log(url)
        //     // if (isImageUrl(url)) await scan(message, url);
        // });

    function checkURL(url: string) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        }
    }
}