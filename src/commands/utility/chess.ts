import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class ChessTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'chess',
            description: 'Chess Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            const invite = await this.client.together.createTogetherCode(message.member.voice.channel.id, "chess");
            const embed = new MessageEmbed()
            .setAuthor(`Chess Together`)
            .setDescription(`[Click here to start Chess](${invite.code})`)
            .setFooter(`Note: only desktop user can use Chess!`)
            message.channel.send({ embeds: [embed] });
            return;
        }

    }
}