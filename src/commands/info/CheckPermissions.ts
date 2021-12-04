import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { GuildMember, Message, MessageEmbed, PermissionFlags } from "discord.js";

export default class CheckPermissions extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "chcekpermissions",
            aliases: ["ckp", "cp"],
            description: "To check user permissions",
            examples: ["checkpermissions @User<User ID / Tag>"],
            group: "Info"
        });
    }

    async run(message: Message, args: string[]) {
        const user = message.mentions.members?.first() || message.guild?.members.cache.find(x => x.nickname === args[0]) || message.guild?.members.cache.get(args[0]) || message.member as GuildMember;

        if (!user) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`❌ Invalid`)
            .setDescription(`I can't find that user`)
            return message.channel.send({ embeds: [embed] });
        }

        const perm = {
            CREATE_INSTANT_INVITE: "✅ Create Instant Invite",
            KICK_MEMBERS: "✅ Kick Members",
            BAN_MEMBERS: "✅ Ban Members",
            ADMINISTRATOR: "✅ Administrator",
            MANAGE_CHANNELS: "✅ Manage Channels",
            MANAGE_GUILD: "✅ Manage Server",
            ADD_REACTIONS: "✅ Add Reaction",
            VIEW_AUDIT_LOG: "✅ View Audit Logs",
            PRIORITY_SPEAKER: "",
            STREAM: "",
            VIEW_CHANNEL: "",
            SEND_MESSAGES: "",
            SEND_TTS_MESSAGES: "",
            MANAGE_MESSAGES: "",
            EMBED_LINKS: "",
            ATTACH_FILES: "",
            READ_MESSAGE_HISTORY: "",
            MENTIONS_EVERYONE: "",
            USER_EXTERNAL_EMOJIS: "",
            VIEW_GUILD_INSIGHT: "",
            CONNECT: "",
            SPEAK: "",
            MUTE_MEMBERS: "",
            DEAFEN_MEMBERS: "",
            MOVE_MEMBERS: "",
            USE_VAD: "",
            CHANGE_NICKNAME: "",
            CHANGE_NICKNAMES: "",
            MANAGE_ROLES: "",
            MANAGE_WEBHOOK: "",
            MANAGE_EMOJIS_AND_STICKERS: "",
            USE_APPLICATION_COMMANDS: "",
            REQUEST_TO_SPEAK: "",
            MANAGE_THREADS: "",
            USE_PUBLIC_THREADS : "",
            CREATE_PUBLIC_THREADS: "",
            USE_PRIVATE_THREADS : "",
            CREATE_PRIVATE_THREADS: "",
            USE_EXTERNAL_STICKERS : "",
            SEND_MESSAGES_IN_THREADS: "",
            START_EMBEDDED_ACTIVITIES: ""
        }
        const permissions = user.permissions
        console.log(permissions.bitfield.toString())

        
    }
}