import { Discord, On, Client, ArgsOf } from "discordx";
import Logger from "../../classes/Logger";

@Discord()
export abstract class AppDiscord {
    @On("messageDelete")
    onMessage([message]: ArgsOf<"messageDelete">, client: Client) {
        if (message.author?.bot) return;
        Logger.log("INFO", `Client:${client.user?.username}\tContent: ${message.content}`);
    }
}