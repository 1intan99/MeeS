import "reflect-metadata";
import { IntentsString } from "discord.js";
import { Client } from "discordx";
import { DiscordTogether } from "discord-together";
import { ICache, IConfig } from "../utils/interface";
import { LavasfyClient } from "lavasfy";
import Registry from "../classes/Registery";
import Erela from "../classes/Lavalink";
import { Manager } from "erela.js";
import Logger from "../classes/Logger";

export default class MeeS extends Client {
    readonly config: IConfig;
    readonly registery: Registry;
    readonly erela: Erela;
    public manager: Manager | undefined;
    public cache: Map<string, ICache>;
    public together: DiscordTogether<{[x: string]: string}>;
    public lavasfy: LavasfyClient | undefined;
    public log: Logger | undefined;

    public constructor(intents: IntentsString[], silent: boolean) {
        super({ intents, botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)], silent})
        
        this.config = {
            token: process.env.TOKEN as string,
            prefix: process.env.PREFIX as string,
            developers: JSON.parse(process.env.DEVELOPERS as string) as string[],
            unknownErrorMessage: JSON.parse(process.env.UNKNOWN_COMMAND_ERROR as string)
        };
        this.erela = new Erela(this);
        this.erela.connect();
        this.registery = new Registry(this);
        this.registery.reregisterAll();
        this.cache = new Map();
        this.together = new DiscordTogether(this);
    }
}