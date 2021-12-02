import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class GiveawayReroll extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "giveawayreroll",
            aliases: ["gr", "reroll"],
            description: "Reroll the giveaways",
            group: "Giveaways",
            examples: ['giveawayreroll 12345678<MessageID>'],
            require: { permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"]}
        });
    }

    async run(message: Message, args: string[]) {
        const messageId = args.join(" ")

        if (!messageId) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing Arguments", this.client.logo)
            .setDescription(`${this.client.prefix}giveawayreroll <messageId>\nEx: ${this.client.prefix}giveawayreroll 123456789`)
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

        this.client.giveaway.reroll(messageId).then(() => {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Giveaway Rerolled!`)
            return message.channel.send({ embeds: [embed] }).then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 3e3)
            });
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when rerolling the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        })
    }
}