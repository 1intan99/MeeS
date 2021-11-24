import { ButtonInteraction, Interaction, TextBasedChannels } from "discord.js";
import MeeS from "../../structures/Client";
import Event from "../../structures/Event";

export default class InteractionEvent extends Event {
    constructor(client: MeeS) {
        super(client, 'interactionCreate');
    }

    async run(interaction: Interaction) {
        try {
            await this.client.executeInteraction(interaction)
        } catch (e) {
            if (interaction.isApplicationCommand() || interaction.isMessageComponent()) {
                return interaction[interaction.replied ? 'editReply' : 'reply'](`Something went back on executing this operation. Please, refer bot developers about errors.`,);
            }
        }
    }
}