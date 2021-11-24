import MeeS from "../structures/Client";
import { Manager } from "erela.js";
import { LavasfyClient } from "lavasfy";
import Deezer from "erela.js-deezer";
import Apple from "erela.js-apple";
import Facebook from "erela.js-facebook"
import Registry from "./Registery";

export default class Lavalink {
    readonly client: MeeS;
    readonly register: Registry;
    constructor(client: MeeS) {
        this.client = client;
        this.register = new Registry(client);
    }

    async connect() {
        const client = this.client;
        const { clientID , clientSecret } = process.env;
        client.lavasfy = new LavasfyClient(
            {
                clientID: clientID as string,
                clientSecret: clientSecret as string,
                playlistLoadLimit: 5,
                audioOnlyResults: true,
                autoResolve: true,
                useSpotifyMetadata: true
            }, [
                {
                    id: 'KiaraLavalink',
                    host: 'lava.kiara.my.id',
                    port: 443,
                    password: 'doggystyle12',
                    secure: true 
            }
        ]);
        client.manager = new Manager({
            plugins: [
                new Deezer({ albumLimit: 5, playlistLimit: 5 }),
                // @ts-ignore
                new Apple(),
                new Facebook()
            ],
            nodes: [
                {
                    identifier: 'Kiara Lavalink',
                    host: 'lava.kiara.my.id',
                    port: 443,
                    password: 'doggystyle12',
                    secure: true
                }
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });
    }
}