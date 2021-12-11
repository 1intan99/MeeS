import MeeS from "./structures/Client";
import { cache, intenst, silent, ws } from "./utils/ClientOptions";

const client: MeeS = new MeeS(intenst, silent, ws, cache);
export default client;