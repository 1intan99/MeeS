import { Message, MessageEmbed, TextChannel } from "discord.js";
import CommandHandler from "../../classes/CommandHandler";
import MeeS from "../../structures/Client";
import { Pool, ModuleThread, spawn, Worker } from "threads"
import Event from "../../structures/Event";
import { ATTACHMENT_CONTENT_TYPE } from "../../utils/contentType";
import { BASE_CONFIG, Category, Content } from "../../utils/nsfwjs";
import { Classifier } from "../../classes/NsfwJs";
import { QueuedTask } from "threads/dist/master/pool-types";
import { ClassificationResult } from "../../utils/interface";

const wokers = Pool(() => spawn<Classifier>(new Worker('../../classes/Nsfwjs')));

export default class MessageCreate extends Event {
    constructor(client: MeeS) {
        super(client, 'messageCreate');
    }

    async run(message: Message) {
        if ((message.channel as TextChannel).nsfw) return;
        if (message.author.bot || message.channel.type == "DM") return;
        await CommandHandler.handleCommand(this.client, message);
        this.client.executeCommand(message);

        const channel = message.channel  as TextChannel;
        const contents: Content[] = [];

        message.attachments.forEach(({ url, name, contentType}) => {
            if(!!contentType && ATTACHMENT_CONTENT_TYPE.includes(contentType)) {
                contents.push({
                    type: contentType === 'image/gif' ? 'gif' : 'image',
                    name: name || 'nsfw-attachment',
                    url
                });
            }
        });

        const isDev = process.env.NODE_ENV === 'development';
        let config = BASE_CONFIG;

        message.embeds.forEach(({ type, url, image, video, thumbnail }) => {
            switch (type) {
                case 'image': {
                    contents.push({
                        type: 'image',
                        name: 'nsfw-embed',
                        url: url as string
                    });
                    break;
                }
                case 'gifv': {
                    if (image) {
                        contents.push({
                            type: 'image',
                            name: 'nsfw-embed',
                            url: image.url
                        });
                        break;
                    }
                }
                case 'rich': {
                    if (image) {
                        contents.push({
                            type: 'image',
                            name: 'nsfw-embed',
                            url: image.url
                        });
                        break
                    }

                    if (video && thumbnail) {
                        contents.push({
                            type: 'image',
                            name: 'nsfw-embed',
                            url: thumbnail.url
                        });
                        break;
                    }
                }
            }
        });

        if (contents.length === 0) {
            return;
        }

        const task: QueuedTask<ModuleThread<Classifier>,ClassificationResult>[] = [];

        contents.forEach(async ({ url, type }) => {
            const classification = wokers.queue(async (classifier) => {
                let start = 0;

                if (isDev) {
                    start = performance.now();
                }

                const category = type === 'gif' ? await classifier.classifyGif(url) : await classifier.classifyImage(url);

                return {
                    source: url,
                    category,
                    time: isDev ? performance.now() - start : undefined
                }
            });

            task.push(classification)
        });

        for await (const { source, category, time} of task) {
            const isNSFW = category.some((x) => {
                return config.categories.includes(x.name) && x.accuracy >= config.accuracy
            });

            const promise = [];

            if (isNSFW) {
                task.forEach(x => x.cancel());

                const categorys = category.find(x => config.categories.includes(x.name)) as Category;

                const fields = [{
                    name: "Author",
                    value: message.author.toString(),
                },
                {
                    name: "Category",
                    value: categorys.name,
                    inline: true,
                },
                {
                    name: "Accuracy",
                    value: `${(categorys.accuracy * 100).toFixed(2)}%`,
                    inline: true
                }];

                if (message.content) {
                    fields.push({
                        name: "Contents",
                        value: message.content,
                        inline: false
                    });
                }

                const embed = new MessageEmbed({
                    author: {
                        name: this.client.user!.username,
                        iconURL: this.client.user?.displayAvatarURL()
                    },
                    title: 'Possible NSFW Contents Detected',
                    fields,
                    color: "RED"
                });

                promise.push(channel.send({ embeds: [embed] }));

                const files = [];

                if (!config.delete) {
                    files.push({
                        attachment: source,
                        name: `SPOILER_${name}`
                    });

                    promise.push(channel.send({ files }));
                }

                await Promise.all(promise);

                if (isNSFW) {
                    break;
                }
            }
        }
    }
}