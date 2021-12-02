import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { BufferResolvable, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { registerFont } from "canvas";
import { Canvas, resolveImage } from "canvas-constructor/cairo";
import { get } from "superagent";
import { serachAnime } from "../../utils/functions";


export default class Anime extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'anime',
            description: 'Search anime',
            group: 'Info',
            cooldown: 5,
            examples: ["anime Kimi No Nawa<Tittle>"]
        })
    }

    async run(message: Message, args: string[]) {
        const name = args.join(" ");

        if (!name) return message.channel.send(`Enter Anime Title!`);


        const data = await serachAnime(name, "max") as any;
        const choice = data.map((x: any, index: any) => `${++index} - ${x.attributes.titles.en_jp}`).join('\n')
        const filter = (m: Message) => m.author.id === message.author.id && /^(\d+|cancel|[1-10])$/i.test(m.content);
        let collection;

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`Result for ${name}`)
        .setDescription(`Becuase some anime doesn't have cover Image, so it'll not showing anything until i fix it\n\u200b\n${choice}`)
        const msg = await message.channel.send({ embeds: [embed] });

        try {
            collection = await msg.channel.awaitMessages({filter, max: 1, time: 6e4, errors: ['time'] });
        } catch (err) {
            message.channel.send(`LoL, So lame....`);
            setTimeout(() => {
                msg.delete();
            }, 300)
            return;
        }

        const res = collection.first()?.content;
        const index = Number(res) - 1;

        if (index < 0 || index > data.length - 1) return msg.channel.send(`The number you entered is smaller or bigger it's [1-${data.length}]`);

        const choices = data[index];
        if (res?.toLowerCase() === "cancel") {
            setTimeout(() => msg.delete(), 3000);
            return message.channel.send(`Cancelling the selection.`);
        } else if (choices) {
            const chc  = [
                `Full Information`,
                `Short Information`
            ];
            const filter =  (m: Message) => m.author.id === message.author.id && /^(\d+|cancel|[1-2])$/i.test(m.content);
            const chcs = String(chc.map((x: any, index: any) => `${++index} - ${x}`).join('\n'));
            let collection;

            embed.setAuthor(`Choice wich information you want to display for ${choices.attributes.titles.en_jp}`)
            embed.setDescription(chcs);
            msg.edit({ embeds: [embed] });

            try {
                collection = await msg.channel.awaitMessages({ filter, max: 1, time: 6e4, errors: ['time'] });
            } catch (err) {
                setTimeout(() =>  message.delete(), 3000);
                return message.channel.send(`LoL, Time is up...`);
            }

            const res = collection.first()?.content;
            const fetch = await message.channel.send(`Getting Information...`);
            setTimeout(() => msg.delete(), 1000);

            if (res?.toLowerCase() === "1") {
                if (!choices.attributes.coverImage) {
                    setTimeout(() => {
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while..'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while...'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while....'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.....'}).then((msg) => msg.delete());
                    }, 2000);

                    registerFont("./src/Font/Anime/ChocolateCoveredRaindrops.ttf", { family: 'ChocolateCoveredRaindrops'});
                    registerFont("./src/Font/Anime/JapanFont.ttf", { family: 'JapanFont'});

                    const { body: background } = await get('https://cdn.discordapp.com/attachments/713193780932771891/822434512096329738/bg2.png');
                    const { body: posterIamge } = await get(choices.attributes.posterImage.original);
                    const { body: coverImage } = await get('https://cdn.discordapp.com/attachments/713193780932771891/823109984334249984/error_404.png');
                    const bg = await resolveImage(background);
                    const pi = await resolveImage(posterIamge);
                    const ci = await resolveImage(coverImage);

                    const canvas = new Canvas(1920, 1080)
                    .printCircularImage(pi, 205, 230, 200)
                    .printImage(ci, 830, 380, 1152, 872)
                    .printImage(bg, 1, 1, 1920, 1080)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('left')
                    .setTextFont('40pt JapanFont')
                    .printText(`${choices.attributes.titles.ja_jp}\n[ ${String(choices.attributes.titles.en_jp).substring(0, 25) + "..."} ]`, 450, 230)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('left')
                    .setTextFont('55pt ChocolateCoveredRaindrops')
                    .printText(choices.attributes.startDate, 300, 500)
                    .printText(choices.attributes.endDate, 280, 610)
                    .printText(choices.attributes.popularityRank, 290, 710)
                    .printText(choices.attributes.ratingRank, 335, 810)
                    .printText(choices.attributes.ageRatingGuide, 300, 910)
                    .printText(choices.attributes.episodeCount, 250, 990)
                    .printText(choices.attributes.showType, 190, 1065)

                    const img = new MessageAttachment(canvas.toBuffer() as BufferResolvable);
                    const attch = await img.attachment
                    await message.channel.send({ files: [attch] });
                    return;
                } else {
                    setTimeout(() => {
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while..'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while...'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while....'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.....'}).then((msg) => msg.delete());
                    }, 2000);

                    registerFont("./src/Font/Anime/ChocolateCoveredRaindrops.ttf", { family: 'ChocolateCoveredRaindrops'});
                    registerFont("./src/Font/Anime/JapanFont.ttf", { family: 'JapanFont'});

                    const { body: background } = await get('https://cdn.discordapp.com/attachments/713193780932771891/822434512096329738/bg2.png');
                    const { body: posterIamge } = await get(choices.attributes.posterImage.original);
                    const { body: coverImage } = await get(choices.attributes.coverImage.original);
                    const bg = await resolveImage(background);
                    const pi = await resolveImage(posterIamge);
                    const ci = await resolveImage(coverImage);

                    const canvas = new Canvas(1920, 1080)
                    .printCircularImage(pi, 205, 230, 200)
                    .printImage(ci, 830, 380, 1152, 872)
                    .printImage(bg, 1, 1, 1920, 1080)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('left')
                    .setTextFont('40pt JapanFont')
                    .printText(`${choices.attributes.titles.ja_jp}\n[ ${String(choices.attributes.titles.en_jp).substring(0, 25) + "..."} ]`, 450, 230)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('left')
                    .setTextFont('55pt ChocolateCoveredRaindrops')
                    .printText(choices.attributes.startDate, 300, 500)
                    .printText(choices.attributes.endDate, 280, 610)
                    .printText(choices.attributes.popularityRank, 290, 710)
                    .printText(choices.attributes.ratingRank, 335, 810)
                    .printText(choices.attributes.ageRatingGuide, 300, 910)
                    .printText(choices.attributes.episodeCount, 250, 990)
                    .printText(choices.attributes.showType, 190, 1065)

                    const img = new MessageAttachment(canvas.toBuffer() as BufferResolvable);
                    const attch = await img.attachment
                    await message.channel.send({ files: [attch] });
                    return;
                }
            } else if (res?.toLowerCase() === "2") {
                if (!choices.attributes.coverImage) {
                    setTimeout(() => {
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while..'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while...'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while....'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.....'}).then((msg) => msg.delete());
                    }, 2000);

                    registerFont("./src/Font/Anime/ChocolateCoveredRaindrops.ttf", { family: 'ChocolateCoveredRaindrops'});
                    registerFont("./src/Font/Anime/JapanFont.ttf", { family: 'JapanFont'});

                    const { body: background } = await get('https://cdn.discordapp.com/attachments/713193780932771891/823076669471326208/bg_rotate_1.png');
                    const { body: coverImage } = await get('https://cdn.discordapp.com/attachments/713193780932771891/823109984334249984/error_404.png');
                    const bg = await resolveImage(background);
                    const ci = await resolveImage(coverImage);

                    const canvas = new Canvas(1080, 1920)
                    .printImage(ci, 1, -100, 1152, 872)
                    .printImage(bg, 1, 1, 1080, 1920)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('center')
                    .setTextFont('55pt JapanFont')
                    .printText(`${choices.attributes.titles.ja_jp}`, 550, 780)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('center')
                    .setTextFont('100pt ChocolateCoveredRaindrops')
                    .printText(choices.attributes.episodeCount, 500, 1095)
                    .printText(choices.attributes.showType, 500, 1330)
                    .printText(choices.attributes.ageRatingGuide, 520, 1580)
                    .printText(choices.attributes.popularityRank, 500, 1830)

                    const img = new MessageAttachment(canvas.toBuffer() as BufferResolvable);
                    const attch = await img.attachment
                    await message.channel.send({ files: [attch] });
                    return;
                } else {
                    setTimeout(() => {
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while..'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while...'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while....'});
                        fetch.edit({ content: 'Rendering Image It\'ll take a while.....'}).then((msg) => msg.delete());
                    }, 2000);

                    registerFont("./src/Font/Anime/ChocolateCoveredRaindrops.ttf", { family: 'ChocolateCoveredRaindrops'});
                    registerFont("./src/Font/Anime/JapanFont.ttf", { family: 'JapanFont'});

                    const { body: background } = await get('https://cdn.discordapp.com/attachments/713193780932771891/823076669471326208/bg_rotate_1.png');
                    const { body: coverImage } = await get(choices.attributes.coverImage.original);
                    const bg = await resolveImage(background);
                    const ci = await resolveImage(coverImage);

                    const canvas = new Canvas(1080, 1920)
                    .printImage(ci, 1, -100, 1152, 872)
                    .printImage(bg, 1, 1, 1080, 1920)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('center')
                    .setTextFont('55pt JapanFont')
                    .printText(`${choices.attributes.titles.ja_jp}`, 550, 780)
                    .save()
                    .setColor('WHITE')
                    .setTextAlign('center')
                    .setTextFont('100pt ChocolateCoveredRaindrops')
                    .printText(choices.attributes.episodeCount, 500, 1095)
                    .printText(choices.attributes.showType, 500, 1330)
                    .printText(choices.attributes.ageRatingGuide, 520, 1580)
                    .printText(choices.attributes.popularityRank, 500, 1830)

                    const img = new MessageAttachment(canvas.toBuffer() as BufferResolvable);
                    const attch = await img.attachment
                    await message.channel.send({ files: [attch] });
                    return;
                }
            }
        } 
    }
}