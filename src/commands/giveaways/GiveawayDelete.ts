import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class GivewawayDelete extends Command {
    constructor(client: MeeS) {
        super(client, { 
            name: "giveawaydelete",
            aliases: ["gd", "gdelete"],
            description: "Delete the Giveaways",
            group: "Giveaways",
            examples: ['giveawaydelete 12345678<MessageID>'],
            require: { permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "SEND_MESSAGES"]}
        });
    }

    async run(message: Message, args: string[]) {
        const messageId = args.join(" ")

        if (!messageId) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing Arguments", this.client.logo)
            .setDescription(`${this.client.prefix}giveawaypause <messageId>\nEx: ${this.client.prefix}giveawayreroll 123456789`)
            return message.channel.send({ embeds: [embed] });
        }

        const giveaway = this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.prize === messageId) || this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId);

        if (!giveaway) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Giveaway Not Found", this.client.logo)
            .setDescription(`I Couldn't find that giveaways! Make sure you give me the right \`messageId\`/\`prize\``)
            return message.channel.send({ embeds: [embed] });
        }

        this.client.giveaway.delete(messageId).then((ga) => {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Successfully | Giveaway has been deleted", this.client.logo)
            .setDescription(`**Giveaway: ${ga.prize}\nWinners: ${ga.winnerCount}\nHosted By: ${ga.hostedBy}\n\nHas been deleted!**\n\n\`⚠️ Note: when you delete the giveaway, data and message of the giveaway are deleted by default, You cannot resote a giveaway once you have deleted it!\``)
            return message.channel.send({ embeds: [embed] });
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when deleting the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        })
    }
}