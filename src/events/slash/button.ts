import { CommandInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import MeeS from "../../structures/Client";
import { queue } from "../../utils/functions";

@Discord()
    export class button {
        private player(client: MeeS, guilId: string) {
            return client.manager?.players.get(guilId);
        }

    @ButtonComponent('btn-leave')
    async stopControl(interaction: CommandInteraction, client: MeeS): Promise<void> {
        if (!this.player(client, interaction.guildId)) {
            interaction.reply(`There is no music play in this server!`);
        }
        this.player(client, interaction.guildId)?.destroy();
        await interaction.deferReply();
        interaction.deleteReply()
        return;
        }
    @ButtonComponent('btn-next')
    async skipControl(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const queue = this.player(client, interaction.guildId);
        if (!queue) {
            interaction.reply(`There is no music play in this server!`);
        }
        queue?.stop();
        await interaction.deferReply();
        interaction.deleteReply()
        return;
        }
    @ButtonComponent('btn-pause')
    async pauseControl(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const queue = this.player(client, interaction.guildId);
        if (!queue) {
            interaction.reply(`There is no music play in this server!`);
        }
        queue?.pause(!queue.paused);
        
        await interaction.deferReply();
        interaction.deleteReply()
        return;
        }
    @ButtonComponent('btn-repeat')
    async repeatControl(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const queue = this.player(client, interaction.guildId);
        if (!queue) {
            interaction.reply(`There is no music play in this server!`);
        }
        queue?.setQueueRepeat(!queue.queueRepeat);
        await interaction.deferReply();
        interaction.deleteReply();
        return;
        }
    @ButtonComponent('btn-controls')
    async repeatTrack(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const queue = this.player(client, interaction.guildId);
        if (!queue) {
            interaction.reply(`There is no music play in this server!`);
        }
        queue?.setTrackRepeat(!queue.trackRepeat);
        await interaction.deferReply();
        interaction.deleteReply();
        }
    @ButtonComponent('btn-queue')
    async queueControls(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const q = this.player(client, interaction.guildId);
        if (!q) {
            interaction.reply(`There is no music play in this server!`);
        }
        await interaction.deferReply();
        interaction.deleteReply();
        await queue(interaction, client);
        return;
        }
    @ButtonComponent("btn-mix")
    async mixControls(interaction: CommandInteraction, client: MeeS): Promise<void> {
        const queue = this.player(client, interaction.guildId);
        if (!queue) {
            interaction.reply(`There is no music play in this server!`);
        }
        queue?.queue.shuffle();
        await interaction.deferReply();
        interaction.deleteReply();
        }
    }