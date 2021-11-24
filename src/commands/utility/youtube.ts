import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class YoutubeTogether extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'youtube',
            aliases: ['yt'],
            description: 'Youtube Together',
            group: 'Utility'
        })
    }

    async run(message: Message): Promise<void> {
        if(!message.member?.voice.channel) {
            message.channel.send({ content: "You're not in voice channel!" });
            return;
        } else {
            this.client.together.createTogetherCode(message.member.voice.channel.id, "youtube").then(async (invite) => {
                const embed = new MessageEmbed()
                .setAuthor(`Youtube Together`)
                .setDescription(`[Click here to start YouTube Together](${invite.code})`)
                .setFooter(`Note: only desktop user can use YouTube Together!`)
                message.channel.send({ embeds: [embed] });
                return;
            })
        }

    }
}