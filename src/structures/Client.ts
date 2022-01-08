import "reflect-metadata";
import { IntentsString, WebSocketOptions, CacheFactory } from "discord.js";
import { Client } from "discordx";
import { DiscordTogether } from "discord-together";
import { ICache, IConfig } from "../utils/interface";
import { LavasfyClient } from "lavasfy";
import Registry from "../classes/Registery";
import Erela from "../classes/Lavalink";
import { Manager } from "erela.js";
import Logger from "../classes/Logger";
import MongoDB from "./MongoClien";
import Giveaways from "../classes/GiveawaysModel";
import SentryLogger from "../classes/SentryLogger";


export default class MeeS extends Client {
    readonly config: IConfig = {
        token: process.env.TOKEN as string,
        prefix: process.env.PREFIX as string,
        developers: JSON.parse(process.env.DEVELOPERS as string) as string[],
        unknownErrorMessage: JSON.parse(process.env.UNKNOWN_COMMAND_ERROR as string)
    };
    readonly registery = new Registry(this);
    readonly erela = new Erela(this);
    public manager: Manager | undefined;
    public cache: Map<string, ICache> = new Map();
    public together: DiscordTogether<{[x: string]: string}> = new DiscordTogether(this);
    public lavasfy: LavasfyClient | undefined;
    public log: Logger | undefined;
    public giveaway = new Giveaways(this, {
        default: {
            botsCanWin: false,
            embedColor: 'GREEN',
            embedColorEnd: 'RED',
            reaction: '🎊'
        }
    });
    public mongo = new MongoDB;
    public readonly logo = "https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png";
    public sentry = new SentryLogger(process.env.DSN as string);

    public constructor(intents: IntentsString[], silent: boolean, ws: WebSocketOptions, makeCache: CacheFactory) {
        super({ intents, botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)], silent, ws, makeCache});

        this.erela.connect();
        this.registery.reregisterAll();
    }
}
