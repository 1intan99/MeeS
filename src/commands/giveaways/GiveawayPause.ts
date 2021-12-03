import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class GiveawayPause extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "giveawaypause",
            aliases: ["gp", "gpause"],
            description: "Pause the Giveaways",
            group: "Giveaways",
            examples: ['giveawaypause 12345678<MessageID>'],
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

        this.client.giveaway.pause(messageId, {
            isPaused: false,
            content: "⛔ **GIVEAWAY HAS BEEN PAUSED** ⛔",
            unPauseAfter: 5e3,
            durationAfterPause: 3e3,
            embedColor: "ORANGE"
        }).then((ga) => {
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Succesfully | Giveaway has been paused", this.client.logo)
            .setDescription(`**Giveaway: ${ga.prize}\nTime: ${ga.remainingTime}\nHosted By: ${ga.hostedBy}\n\nHas been paused`)
            return message.channel.send({ embeds: [embed] });
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | There is some error when pausing the giveaway")
            .setDescription(`\`\`\`${err}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        });
    }
}