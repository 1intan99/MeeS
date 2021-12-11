import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class PokerTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'poker',
            description: 'Poker Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "poker").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Poker Together`)
                .setDescription(`[Click here to start Poker](${invite.code})`)
                .setFooter(`Note: only desktop user can use Poker!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}