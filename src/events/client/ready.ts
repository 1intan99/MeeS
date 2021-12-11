import Logger from '../../classes/Logger';
import DiscordClient from '../../structures/Client';
import Event from '../../structures/Event';

export default class ReadyEvent extends Event {
    constructor(client: DiscordClient) {
        super(client, 'ready');
    }

    async run() {
        this.client.initApplicationCommands({
            guild: { log: false },
            global: { log: false }
        });
        await this.client.initApplicationPermissions();
        await this.client.manager?.init(this.client.user!.id);
        Logger.log('SUCCESS', `Logged in as "${this.client.user?.tag}".`);

        this.client.user?.setActivity("n!help", { type: 'PLAYING' });
    }
}
