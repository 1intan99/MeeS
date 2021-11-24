import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";
import util from "util";
import req from "snekfetch";

export default class EvalCommand extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'eval',
            aliases: ['e'],
            group: 'Developer',
            require: { developer: true }
        });
    }

    async run(message: Message, args: string[]) {
        const code = args.join(" ");
        const embed = new MessageEmbed()
            .setTitle(`${this.client.user?.tag}'s Evaled`)
            .setColor("RANDOM")
            .addField("Input", `\`\`\`js\n${code}\`\`\``)
            .setFooter(`Request for ${message.author.tag}`, message.author.avatarURL({ dynamic: true}) as string);

        try {
            if (code.toLowerCase().includes("token")) return message.channel.send("トークンがありません")
            var evaled = eval(code)

            var output = util.inspect(evaled, { depth: 0});
            if (output.length > 1024) {
                const { body } = await req.post("http://tk-bin.glitch.me/documents").send(output) as any;
                embed.addField("Output", `http://tk-bin.glitch.me/${body.key}.js`);
                embed.addField("Type", typeof evaled);
            } else {
                embed.addField("Output", `\`\`\`js\n${output}\`\`\``);
                embed.addField("Type", typeof evaled);
            }
        } catch (e) {
            const error = (e) as any;
            if (error.length > 1024) {
                const { body } = await req.post("http://tk-bin.glitch.me/documents").send(error) as any;
                embed.addField("Error", `http://tk-bin.glitch.me/${body.key}.js`);
                embed.addField("Type", typeof evaled);
            } else {
                embed.addField("Error", `\`\`\`js\n${error}\`\`\``);
                embed.addField("Type", typeof evaled);
            }
        }
        return message.channel.send({ embeds: [embed] });
    }

    async aw(code: string) {
        const evalu = await eval(code)
        return evalu
    }
}