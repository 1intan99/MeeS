import { Message, MessageEmbed, TextChannel } from "discord.js";
import MeeS from "../../structures/Client";
import Command from "../../structures/Command";
import ms from 'ms'
import { convertTime, randomId } from "../../utils/functions";

export default class GiveawayStart extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'giveawaystart',
            aliases: ['ga', 'gcreate'],
            description: 'Start Giveaways',
            group: 'Giveaways',
            examples: ['giveawaystart #channel<TextChannel> 10h<Time> 2<Winners> Nitro<Prize ( You can use space at prize)>'],
            require: { permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "SEND_MESSAGES"]}
        });
    }

    async run(message: Message, args: string[]) {
        const [channel, dur, winner, ...pri] = args

        const ch = (message.mentions.channels.first() || message.guild?.channels.cache.get(channel) || message.guild?.channels.cache.find((x) =>  new RegExp(`${x.name}`, 'i').test(channel)) || message.channel as TextChannel) as TextChannel;

        if (!dur || !winner || !pri) {
            const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`❌ Error | Missing Argument`, this.client.logo)
            .setDescription(`**Please enter the right argument\n\nEx: #channel<textChannel> 1h<time> 1<winners> Nitro Classic<prize>**`)
            .setFooter(`Don't include <>`);
            return message.channel.send({ embeds: [embed ]});
        }

        if (ms(dur) < 1e4) {
            const embed = new MessageEmbed()
            .setColor(`RED`)
            .setAuthor(`❌ Error | Format Time`, this.client.logo)
            .setDescription(`**Duration can't be less than 10s**`)
            return message.channel.send({ embeds: [embed] });
        }

        const duration = ms(dur);
        const winnerCount = Number(winner);
        const prize = pri.join(' ');
        const Id = await randomId(4);

        this.client.giveaway.start(ch, {
            duration: duration,
            winnerCount,
            prize,
            messages: {
                giveaway: "🎊 **GIVEAWAY STARTED** 🎊",
                giveawayEnded: "🎊 **GIVEAWAY ENDED** 🎊",
                drawing: "Time: {timestamp}",
                dropMessage: "Be the first to react with 🎊 !",
                inviteToParticipate: "React with 🎊 to enter the giveaway!",
                winMessage: "Ayo! Congrats to {winners}! You won **{this.prize}**!",
                embedFooter: `{this.winnerCount} winners(s) | ${Id}`,
                noWinner: "There's no winner here, Giveaway cancelled",
                hostedBy: "Giveaway Hosted By: {this.hostedBy}",
                winners: "Winner(s):",
                endedAt: "Ended at",
            },
            lastChance: {
                enabled: true,
                embedColor: "YELLOW",
                content: "⚠️ **LAST CHANGE TO ENTER GIVEAWAY !** ⚠️",
                threshold: 8e3,
            },
            extraData: {
                giveawayId: Id
            },
            hostedBy: message.author
        }).then((ga) => {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Successfully | Giveaway has been srated", this.client.logo)
            .setDescription(`**Giveaway Channel: <#${ga.channelId}>\nGiveaway: ${ga.prize}\nWinner(s): ${ga.winnerCount}\nTime: ${convertTime(ga.duration)}\nHosted By: ${ga.hostedBy}**`)
            return message.channel.send({ embeds: [embed] });
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when starting the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        })
    }
}