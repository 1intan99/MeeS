import { IManagerEvents } from "../utils/interface";
import MeeS from "./Client";

export default abstract class Lava {
    
    /**
     * Discord Client
     */
    readonly client: MeeS;

    /**
     * Erela Event name
     */
    readonly info: IManagerEvents;

    constructor (client: MeeS, info: IManagerEvents) {
        this.client = client,
        this.info = info;
    }

    /**Run events
     * @param params Event parameters from [Erela.Js](https://erelajs-docs.netlify.app/docs/classes/manager.html)
     */

    abstract run(...params: any | undefined): Promise<any>;
}