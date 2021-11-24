import MeeS from "../../structures/Client";
import Event from "../../structures/Event";

export default class RawEvent extends Event {
    constructor(client: MeeS) {
        super(client, 'shardDisconnect')
    }

    async run(event: CloseEvent, id: number) {
        console.log(`Shard Disconnect Because: ${event.reason} with id: ${id}`);
    }
}