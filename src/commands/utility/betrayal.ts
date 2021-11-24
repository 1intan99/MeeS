import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class BetrayalTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'betrayal',
            description: 'Betrayal Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "betrayal").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Betrayal Together`)
                .setDescription(`[Click here to start Betrayal](${invite.code})`)
                .setFooter(`Note: only desktop user can use Betrayal!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}