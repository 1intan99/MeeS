import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class AwkwordTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'awkword',
            description: 'Awkword Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "awkword").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Awkword Together`)
                .setDescription(`[Click here to start Awkword](${invite.code})`)
                .setFooter(`Note: only desktop user can use Awkword!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}