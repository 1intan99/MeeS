import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class ChessTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'checkers',
            description: 'Checkers Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "checkers").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Checkers Together`)
                .setDescription(`[Click here to start Checkers in the Park](${invite.code})`)
                .setFooter(`Note: only desktop user can use Checkers in the Park!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}