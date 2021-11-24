import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../classes/Logger";

export default class NodeError extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'nodeError'
        })
    }

    async run(node: Node, reason: any) {
        Logger.log(`ERROR`, reason.reason);
    }
}