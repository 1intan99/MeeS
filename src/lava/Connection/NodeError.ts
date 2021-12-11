import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../classes/Logger";
import SentryLogger from "../../classes/SentryLogger";

export default class NodeError extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'nodeError'
        })
    }

    async run(node: Node, err: any) {
        SentryLogger.getInstance().logger(err.reason)
        Logger.log(`ERROR`, err.reason);
    }
}