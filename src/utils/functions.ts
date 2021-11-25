import { Pagination, PaginationResolver } from '@discordx/utilities';
import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, MessageSelectMenu } from 'discord.js';
import 'moment-duration-format';

import moment from 'moment-timezone';
import { options, search } from 'snekfetch';
import MeeS from '../structures/Client';
import request from 'request';
import load from 'lodash';

import DiscordClient from '../structures/Client';
import { title } from 'process';
import Logger from '../classes/Logger';

const isConstructorProxyHandler = {
    construct() {
        return Object.prototype;
    }
};

export function isConstructor(func: any, _class: any) {
    try {
        new new Proxy(func, isConstructorProxyHandler)();
        if (!_class) return true;
        return func.prototype instanceof _class;
    } catch (err) {
        return false;
    }
}

/**
 * Checks user is a developer or not.
 * @param client Discord client
 * @param userId Discord id of the user
 */
export function isUserDeveloper(client: DiscordClient, userId: string) {
    return client.config.developers.includes(userId);
}

/**
 * Formats seconds and returns as given format.
 * @param seconds Seconds
 * @param format Custom format of output (Default: "Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]")
 */
export function formatSeconds(seconds: number, format: string = 'Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]'): string {
    const str = moment.duration(seconds, 'seconds').format(format);
    const arr = str.split(' ');
    var newStr = '';
    arr.forEach((value, index) => {
        if (isNaN(parseInt(value))) return;
        const val = parseInt(value);
        if (val === 0) return;
        else {
            const nextIndex = arr[index + 1];
            newStr += `${value} ${nextIndex} `;
        }
    });
    return newStr.trim();
}
/**
 * Formats duration for music player
 * @param duration Miliseconds
 */
export function convertTime(duration: number): number | unknown {

    let milliseconds = parseInt((duration as any % 1000 as any) / 100 as any)
    let    seconds = parseInt((duration as any / 1000 as any) % 60 as any) as any
    let   minutes = parseInt((duration as any / (1000 * 60) as any) % 60 as any) as any
    let    hours = parseInt((duration as any / (1000 * 60 * 60) as any) % 24 as any) as any;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (duration < 3600000) {
        return minutes + ":" + seconds ;
    } else {
        return hours + ":" + minutes + ":" + seconds ;
    }
}

/**
 * Music Button To Control the music
 * @param client MeeS Client
 * @param guild Guild Id of the music player
 */

export async function button(client: MeeS, guild: string) {
    const player = client.manager?.players.get(guild);
    const skip = new MessageButton()
    .setLabel(`⏭`)
    .setStyle('PRIMARY')
    .setDisabled(!player?.playing)
    .setCustomId(`btn-next`)
    const pauseButton = new MessageButton()
    .setLabel(`⏯`)
    .setStyle(`PRIMARY`)
    .setCustomId(`btn-pause`)
    const stopButton = new MessageButton()
    .setLabel('✖️')
    .setStyle("DANGER")
    .setCustomId("btn-leave");
    const repeatButton = new MessageButton()
    .setLabel("🔂")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId("btn-controls");

    const row1 = new MessageActionRow().addComponents(
        skip,
        pauseButton,
        stopButton,
        repeatButton
    );
    const queueButton = new MessageButton()
    .setLabel("📜")
    .setStyle("PRIMARY")
    .setCustomId("btn-queue");
    const mixButton = new MessageButton()
    .setLabel("🎛️")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId("btn-mix");
    const controlsButton = new MessageButton()
    .setLabel("🔂")
    .setStyle("PRIMARY")
    .setDisabled(!player?.playing)
    .setCustomId("btn-repeat");

    const row2 = new MessageActionRow().addComponents(
        queueButton,
        mixButton,
        controlsButton
    );
    return [row1, row2];
}

/**
 * Queue System of Music Player
 * @param interaction Discord Command Interaction
 * @param client MeeS Discord Client
 * @returns 
 */
export async function queue(interaction: CommandInteraction, client: MeeS) {
    try {
        const player = client.manager?.players.get(interaction.guildId as string);
        const currentTrack = player?.queue.current;
    
        if (!player?.playing || !currentTrack) {
            const pMsg = interaction.reply('Could not process queue atm, try later!');
            if (pMsg instanceof CommandInteraction) {
                setTimeout(() => pMsg.deleteReply(), 3e3);
            }
            return;
        }
    
        if (player.queue.length === 0 || !player.queue.length) {
            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Now playing [${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}`);
    
            await interaction.channel?.send({ embeds: [embed] }).catch(() => {});
        } else {
            const queue = player.queue.map((track, index) => `\`${++index}\` - [${track.title}](${track.uri}) \`[${convertTime(track.duration as number)}]\` - ${track.requester}`);
    
            const mapping = load.chunk(queue, 10);
            const pages = mapping.map((s) => s.join("\n"));
            let page = 0;
    
            if (player.queue.size < 11) {
                const embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                .setTimestamp()
                .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                .setTitle(`${interaction.guild?.name} Queue`);
    
                await interaction.channel?.send({ embeds: [embed] }).catch(() => {});
            } else { 
                const embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                .setTimestamp()
                .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                .setTitle(`${interaction.guild?.name} Queue`);
    
                const forward = new MessageButton()
                .setCustomId("btn-forward")
                .setEmoji("⏭️")
                .setStyle("PRIMARY")
    
                const backward = new MessageButton()
                .setCustomId("btn-backward")
                .setEmoji("⏮️")
                .setStyle("PRIMARY")
    
                const end = new MessageButton()
                .setCustomId("btn-end")
                .setEmoji("⏹️")
                .setStyle("DANGER")
    
                const row1 = new MessageActionRow().addComponents([ backward, end, forward ]);
                const msg = await interaction.channel?.send({ embeds: [embed], components: [row1] }).catch(() => {});
    
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (b: MessageComponentInteraction) => {
                        if (b.user.id === interaction.member.user.id) return true;
                        else {
                            b.reply({ ephemeral: true, content: `Only **${interaction.member.user}** can use this button, if you want then you've to run the command again.`})
                            return false;
                        }
                    },
                    time: 6e4,
                    idle: 30e3
                });
    
                collector?.on("collect", async (button) => {
                    if (button.customId === "btn-forward") {
                        await button.deferUpdate().catch(() => {});
                        page = page + 1 < pages.length ? ++page : 0;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch(() => {});
                    } else if (button.customId === "btn-backward") {
                        await button.deferUpdate().catch(() => {});
                        page = page > 0 ? --page : pages.length - 1;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch(() => {});
                    } else if (button.customId === "btn-end") {
                        await button.deferUpdate().catch(() => {});
                        collector.stop();
                    } else  return;
                });
    
                collector?.on("end", async () => {
                    await msg?.delete();
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Create Music Progress Bar
 * @param total Number of player
 * @param current Number of player position
 * @param size Number of queue size
 * @param line Progress Bar line
 * @param slider Progress Bar slider
 * @returns 
 */
export function progressBar(total: number, current: number, size: number, line: string, slider: string) {
    if (current > total) {
        const bar = line.repeat(size + 2);
        return bar;
    } else {
        const percentage = current / total;
        const progress = Math.round((size * percentage));
        const emptyProgress = size - progress;
        const progressText = line.repeat(progress).replace(/.$/, slider);
        const emptyProgressText = line.repeat(emptyProgress);
        const bar = progressText + emptyProgressText;
        return bar;
    }
}

/**
 * Kitsu.io API's wrapper
 * @param search Anime Title
 * @param maxResult Max Result of anime
 * @returns 
 */
export function serachAnime(search: string, maxResult = "max" as any) {
    const kitsu = request.defaults({
        baseUrl: `https://kitsu.io/api/edge`,
        headers: {
            "UserAgent": "Kitsu.js, a npm module for the kitsu.io API.",
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json"
        }
    })


    if (!search) throw new Error(`No Title!`);
    return new Promise((resolve) => {
        const page = 0;
        const searchTerm = encodeURIComponent(search);
        kitsu.get(`anime?filter[text]="${searchTerm}"&page[offset]=${page}`, (err, response, body) => {
            const res = JSON.parse(body);
            const cb = () => {
                if (maxResult > res.data.length) maxResult = res.data.length;
                if (maxResult == "max") maxResult = res.data.length;

                const results = [];

                for (let i = 0; i < maxResult; i++) {
                    results.push(res.data[i])
                }
                return results;
            }
            resolve(cb());
        });
    });
}

/**
 * Create Select Menu for Help Command.
 * @param array Array of command list
 * @returns 
 */
export function createMenu(array: string[]) {
    if (!array) Logger.log(`ERROR`, "The options were not provided! Make sure you provide all the options!");
    if (array.length < 0) Logger.log(`ERROR`, `The array has to have atleast one thing to select!`);

    let select_menu;
    const id = "menu-help";
    const menus = [] as any;

    array.forEach((x) => {
        const name = x;
        const sName = `${name.toUpperCase()}`;
        const tName = name.toLowerCase();
        const fName = name.toUpperCase();

        return menus.push({
            label: sName,
            description: `${tName} commands!`,
            value: fName
        });
    });

    const embed = new MessageSelectMenu()
    .setCustomId(id)
    .setPlaceholder(`Choose the command category`)
    .addOptions(menus)

    select_menu = new MessageActionRow()
    .addComponents(embed);

    return {
        smenu: [select_menu],
        sid: id
    }
}