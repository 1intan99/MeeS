import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class FishingTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'fishing',
            description: 'Fishing Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "fishing").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Fishing Together`)
                .setDescription(`[Click here to start Fishing](${invite.code})`)
                .setFooter(`Note: only desktop user can use Fishing!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}