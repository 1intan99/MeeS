import MeeS from "./structures/Client";
import { join } from "path";
const client: MeeS = new MeeS(['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'], true);
export default client;