import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { SelectMenuInteraction, Message, MessageActionRow, MessageComponentInteraction, MessageSelectMenu, TextChannel } from "discord.js";
import { nsfwModel } from "../../model/nsfw";

export default class NsfwConfig extends Command {
    constructor(client: MeeS) {
        super(client, { 
            name: 'nsfwconfig',
            aliases: ["nsfwc", "nc"],
            description: "Anti-NSFW Config to moderate image",
            examples: ["nsfwconfig add", "nsfwconfig add #channel<TextChannel>"],
            group: "Administrator",
            require: { permissions: ["MANAGE_CHANNELS"] }
        })
    }

    async run(message: Message, args: string[]) {
        let nsfw = await nsfwModel.findOne({ gudilId: message.guild!.id });

        if (!args[0]) {
            let menus: { label: string, description: string, value: string }[] = [];
            const text = message.guild?.channels.cache.filter(ch => ch.type === "GUILD_TEXT")
            text?.map(x => {
                menus.push({
                    label: `#${x.name}`,
                    description: `ID: ${x.id}`,
                    value: x.id
                })
            })
            const select = new MessageSelectMenu()
            .setCustomId("nsfw-menu")
            .setPlaceholder("Choose where i should to moderate the image")
            .addOptions(menus);

            const select_menus = new MessageActionRow().addComponents(select);
            return message.channel.send({ content: `Please select wich channel should i moderate?\nMake sure that channel isn't NSFW channel, cuase NSFW channel will be ingored`, components: [select_menus]}).then((msg) => {
                const select = async (interaction: SelectMenuInteraction) => {
                    if (interaction.customId != "nsfw-menu") return;

                    let { values } = interaction;
                    let value = values[0];
                    if (!nsfw) {
                        nsfw = new nsfwModel({
                            guildId: msg.guild?.id
                        });
                        nsfw.channelId.push(value);
                        await nsfw.save();
                        msg.edit({ content: `✅ Successful added <#${value}> to databse. I'll watching that channel from NSFW content.`, components: []}).then(mmsg => {
                            setTimeout(() => {
                                mmsg.delete();
                            }, 2000)
                        })
                        console.log(nsfw)
                    } else {
                        const already = nsfw.channelId.find((x: any) => x === value);
                        if (already) {
                            return msg.edit({ content: "Look's like that channel already in database.", components: [] });
                        }
                        if (nsfw.channelId.length > 2) return msg.edit({ content: "Opps... Sorry, But you can't add more than 3 channel to moderate", components: [] });
                        nsfw.channelId.push(value);
                        await nsfw.save();
                        msg.edit({ content: `✅ Successful added <#${value}> to databse. I'll watching that channel from NSFW content.`, components: []}).then(mmsg => {
                            setTimeout(() => {
                                mmsg.delete();
                            }, 2000)
                        })
                        console.log(nsfw)
                    }

                    await interaction.deferReply();
                    setTimeout(() => {
                        interaction.deleteReply().catch(err => {});
                    }, 2000)
                }
                const filter = (interaction: SelectMenuInteraction): boolean => {
                    if (interaction.user.id === message.author.id) return true
                    else {
                        interaction.reply({ ephemeral: true, content: `Only **${message.author}** can select the menu`});
                        return false
                    }
                }
                const collector = msg.createMessageComponentCollector({
                    filter,
                    componentType: "SELECT_MENU"
                });
                collector.on("collect", (int) => { select(int) });
                collector.on("end", () => { null });
            })
        } else if (args[0] === "add") {
            const [ channel ] = args;
            const ch = (message.mentions.channels.first() || message.guild?.channels.cache.get(channel) || message.guild?.channels.cache.find((x) =>  new RegExp(`${x.name}`, 'i').test(channel)) || message.channel as TextChannel) as TextChannel;

            if (!nsfw) {
                nsfw = new nsfwModel({
                    guildId: message.guild!.id
                });
                nsfw.channelId.push(ch.id);
                await nsfw.save();
            } else {
                const already = nsfw.channelId.find((x: any) => x === ch.id);
                if (already) return message.channel.send({ content: "Look's like that channel already in database." });
                if (nsfw.channelId.length > 2) return message.channel.send({ content: "Opps... Sorry, But you can't add more than 3 channel to moderate" });
                nsfw.channelId.push(ch.id);
                await nsfw.save();
            }
        }
    }
}