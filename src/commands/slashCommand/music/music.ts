import { CommandInteraction, GuildMember, Message, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from "discordx";
import { TrackUtils } from 'erela.js';
import { LavalinkTrack } from 'lavasfy';
import Logger from '../../../classes/Logger';
import MeeS from '../../../structures/Client';
import { convertTime } from '../../../utils/functions';

@Discord()
    export class music {
        @Slash("play", { description: 'Play a song'})
            async play(@SlashOption("name", { description: 'song', required: true}) songName: string, interaction: CommandInteraction, client: MeeS): Promise<void> {
                await interaction.deferReply({ ephemeral: false });
                if(!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
                    interaction.editReply({ content: "You're not in voice channel!" });
                    return;
                }

                if (songName.startsWith("https://open.spotify.com/playlist/")) {
                    interaction.editReply({ embeds: [new MessageEmbed().setAuthor(`Spotify`, "https://i.imgur.com/cK7XIkw.png").setColor("AQUA").setTimestamp().setDescription(`Playlist is loding please wait...`)]}).then(() => setTimeout(() => { interaction.deleteReply()}, 3000));
                    return;
                } else if (songName.startsWith("https://open.spotify.com/album/")) {
                    interaction.editReply({ embeds: [new MessageEmbed().setAuthor(`Spotify`, "https://i.imgur.com/cK7XIkw.png").setColor("AQUA").setTimestamp().setDescription(`Album is loding please wait...`)]}).then(() => setTimeout(() => { interaction.deleteReply()}, 3000));
                    return;
                }

                const player = client.manager?.create({
                    guild: interaction.guildId as string,
                    textChannel: interaction.channelId  as string,
                    voiceChannel: interaction.member?.voice.channelId as string,
                    volume: 50 as number,
                    selfDeafen: true as boolean
                });

                if (player?.state !== "CONNECTED") player?.connect();

                try {
                    if (songName.match(client.lavasfy?.spotifyPattern as RegExp)) {
                        await client.lavasfy?.requestToken();
                        const node = client.lavasfy?.nodes.get("KiaraLavalink")
                        const search = await node?.load(songName)
                        if (search?.loadType === "PLAYLIST_LOADED") {
                            let songs = [];
                            for (let i = 0; i < search.tracks.length; i++) 
                            songs.push(TrackUtils.build(search.tracks[i] as LavalinkTrack, interaction.member.user));
                            player?.queue.add(songs);
                            if (!player?.playing && !player?.paused && player?.queue.totalSize === search.tracks.length)
                            player?.play();
                            const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTimestamp()
                            .setDescription(`**Added Playlist to queue** [${search.playlistInfo.name}](${songName}) - [\`${search.tracks.length}\`]`);
                            const m = await interaction.editReply({ embeds: [embed] }) as Message;
                            setTimeout(() => {
                                m.delete()
                            }, 5e3);
                            return;
                        } else if (search?.loadType.startsWith("TRACK")) {
                            player?.queue.add(TrackUtils.build(search.tracks[0] as LavalinkTrack));
                            if (!player?.playing && !player?.paused && !player?.queue.size)
                            player?.play();
                            const embed = new MessageEmbed()
                            .setColor("RED")
                            .setTimestamp()
                            .setDescription(`**Added to queue** - [${search.tracks[0].info.title}](${search.tracks[0].info.uri})`)
                            const m = await interaction.editReply({ embeds: [embed] }) as Message;
                            setTimeout(() => {
                                m.delete();
                            }, 5e3)
                            return;
                        } else {
                            interaction.editReply({ embeds: [new MessageEmbed().setColor('RED').setTimestamp().setDescription('there were no results found.')]});
                            setTimeout(() => {
                                interaction.deleteReply();
                            }, 5e3);
                            return;
                        }
                    } else {
                        let res;
                        try {
                            res = await player?.search(songName, interaction.member.user)
                            if (res?.loadType === "LOAD_FAILED") {
                                throw res.exception;
                            }
                        } catch (e: any) {
                            Logger.log('ERROR', e);
                            interaction.editReply(`Error while searching: ${e.message as string}`);
                        }
                
                        switch (res?.loadType) {
                            case "NO_MATCHES": {
                                if (!player?.queue.current) {
                                    player?.destroy();
                                }
                                await interaction.editReply(`There no found for: ${songName as string}`);
                                setTimeout(() => {
                                    interaction.deleteReply();
                                }, 5e3)
                                return;
                            }
                            case "TRACK_LOADED": {
                                const track = res.tracks[0];
                                player?.queue.add(track);
                                if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                                    const embed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTimestamp()
                                    .setThumbnail(track.displayThumbnail("hqdefault"))
                                    .setDescription(`**Added Songs to queue**\n[${track.title}](${track.uri}) - \`${convertTime(track.duration)}\``);
                                    const m = await interaction.editReply({ embeds: [embed] }) as Message;
                                    setTimeout(() => {
                                        m.delete();
                                    }, 5e3)
                                    return;
                            }
                            case "PLAYLIST_LOADED": {
                                player?.queue.add(res.tracks);
                                if (!player?.playing && !player?.paused && player?.queue.totalSize === res.tracks.length) player.play();
                                const embed = new MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .setDescription(`**Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist?.name}** - \`[${convertTime(res.playlist?.duration as number)}]\``);
                                const m = await interaction.editReply({ embeds: [embed] }) as Message;
                                setTimeout(() => {
                                    m.delete();
                                }, 5e3)
                                return;
                            }
                            case "SEARCH_RESULT": {
                                const track = res.tracks[0];
                                player?.queue.add(track);
                                if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                                    const embed = new MessageEmbed()
                                    .setColor('RED')
                                    .setTimestamp()
                                    .setThumbnail(track.displayThumbnail("hqdefault"))
                                    .setDescription(`**Added Songs to queue**\n[${track.title}](${track.uri}) - \`${convertTime(track.duration)}\``);
                                    const m = await interaction.editReply({ embeds: [embed] }) as Message;
                                    setTimeout(() => {
                                        m.delete();
                                    }, 5e3)
                                    return;
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
        }
    @Slash("pause")
        async pause(interaction: CommandInteraction, client: MeeS): Promise<void> {
            if(!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
                interaction.editReply({ content: "You're not in voice channel!" });
                return;
            }

            const player = client.manager?.players.get(interaction.guildId)

            if (!player) {
                interaction.reply("Ther'e is no music playing at this server");

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }

            if (player?.paused) {
                interaction.reply("Music already paused!");

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }

            player?.pause(!player.paused);
            interaction.reply("Music has been paused!");

            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);
        }
    @Slash("resume")
        async resume(interaction: CommandInteraction, client: MeeS) {
            if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
                return interaction.reply("You're not in voice channel!");
            }

            const player = client.manager?.players.get(interaction.guildId);

            if (!player) {
                interaction.reply("Ther'e is no music playing at this server");

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }

            if (!player?.paused) {
                interaction.reply("Music already resumed!");

                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }

            player?.pause(!player.paused);
            
            interaction.reply("Music has been resumed!");
            
            setTimeout(() => {
                interaction.deleteReply();
            }, 5000);
        }
    }