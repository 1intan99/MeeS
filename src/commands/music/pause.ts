import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message } from "discord.js";

export default class Pause extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'pause',
            description: 'Pause the music',
            group: 'Music',
            examples: ['pause']
        });
    }

    async run(message: Message) {
        if (!message.member?.voice.channel) {
            message.channel.send(`You're not in voice channel!`);
        };

        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`There is no music play at this server!`);
        if (player?.paused) return message.channel.send(`Music already paused!`);

        player?.pause(!player.paused);
        return message.channel.send(`Music has been paused!`);
    }
}