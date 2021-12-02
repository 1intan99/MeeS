import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class GiveawayEdit extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "giveawayedit",
            aliases: ["ge", "edit"],
            description: "Edit The Giveaways",
            group: "Giveaways",
            examples: ["giveawayedit 12345678<messageId> 2<Winners> Nitro Classic<Prize>"],
            require: { permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"]}
        });
    }

    async run(message: Message, args: string[]) {
        const [messageId, winner, ...prize] = args;
        const pri = prize.join(" ");

        if (!messageId) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing MessageID Arguments", this.client.logo)
            .setDescription(`${this.client.prefix}giveawayedit <messageId> <winners> <prize>\nEx: ${this.client.prefix}giveawayedit 123456789 1 real cash`)
            return message.channel.send({ embeds: [embed] });
        } else if (!winner) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing Winners Arguments", this.client.logo)
            .setDescription(`${this.client.prefix}giveawayedit <messageId> <winners> <prize>\nEx: ${this.client.prefix}giveawayedit 123456789 1 real cash`)
            return message.channel.send({ embeds: [embed] });
        } else if (!pri) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing Prize Arguments", this.client.logo)
            .setDescription(`${this.client.prefix}giveawayedit <messageId> <winners> <prize>\nEx: ${this.client.prefix}giveawayedit 123456789 1 real cash`)
            return message.channel.send({ embeds: [embed] });
        }

        const giveaway = this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.prize === messageId) || this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId) || this.client.giveaway.giveaways.find((g: any) => g.guildId === message.guildId && g.extraData.giveawayId === messageId);

        if (!giveaway) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Giveaway Not Found", this.client.logo)
            .setDescription(`I Couldn't find that giveaways! Make sure you give me the right \`messageId\`,\`prize\`,\`Id\``)
            return message.channel.send({ embeds: [embed] });
        }

        this.client.giveaway.edit(messageId, {
            newWinnerCount: Number(winner),
            newPrize: pri
        }).then((ga) => {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`✅ Successfully | Giveaway has been edited`, this.client.logo)
            .setDescription(`Winner: ${ga.winnerCount}\nPrize: ${ga.prize}`)
            return message.channel.send({ embeds: [embed] });
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when editing the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        });
    }
}