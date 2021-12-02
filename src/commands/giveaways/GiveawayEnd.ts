import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class GiveawayEnd extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'giveawayend',
            aliases: ["gn", "gend"],
            description: "End the Giveaways",
            group: "Giveaways",
            examples: ['giveawayend 12345678<MessageID>'],
            require: { permissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"]}
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

        const giveaway = this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.prize === messageId) || this.client.giveaway.giveaways.find((g) => g.guildId === message.guildId && g.messageId === messageId) || this.client.giveaway.giveaways.find((g: any) => g.guildId === message.guildId && g.extraData.giveawayId === messageId);

        if (!giveaway) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Giveaway Not Found", this.client.logo)
            .setDescription(`I Couldn't find that giveaways! Make sure you give me the right \`messageId\`/\`prize\``)
            return message.channel.send({ embeds: [embed] });
        }

        this.client.giveaway.end(messageId).then(() => {}).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when ending the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        });
    }
}