import { CacheFactory, IntentsString, Options } from "discord.js";

export const intenst: IntentsString[] = [    
    'GUILDS',
    'GUILD_BANS',
    'GUILD_MEMBERS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_WEBHOOKS',
    'GUILD_INVITES',
    'GUILD_VOICE_STATES',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MESSAGE_TYPING',
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'DIRECT_MESSAGE_TYPING'];
export const silent: boolean = true;
export const ws: { large_threshold: number } = { large_threshold: 150 }
export const cache: CacheFactory = Options.cacheWithLimits({
    GuildMemberManager: Infinity,
    MessageManager: Infinity,
    UserManager: Infinity,
    ApplicationCommandManager: Infinity
})
