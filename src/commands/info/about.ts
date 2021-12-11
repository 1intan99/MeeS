import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import { Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export default class About extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "about",
            description: "About me",
            examples: ["about"],
            group: "Info"
        })
    }

    async run(message: Message) {
        const donation = new MessageButton()
        .setEmoji("💰")
        .setLabel("Donation")
        .setStyle("LINK")
        .setURL("https://naotmori.carrd.co/")

        const github = new MessageButton()
        .setLabel("GitHub")
        .setStyle("LINK")
        .setURL("https://github.com/ameliakiara/MeeS")
        .setEmoji("<:github:918318537532137532>")

        const website = new MessageButton()
        .setLabel("Website")
        .setStyle("LINK")
        .setURL("https://naotmori.carrd.co/")
        .setEmoji("🌐")

        const invite = new MessageButton()
        .setLabel("Invite me")
        .setStyle("LINK")
        .setURL("https://discord.com/oauth2/authorize?client_id=904209927415930950&permissions=155629447415&scope=bot%20applications.commands")
        .setEmoji("<:add:918319551601590303>")

        const row = new MessageActionRow().addComponents(donation, github, website, invite);

        const embed = new MessageEmbed()
        .setAuthor("About Me", this.client.user!.displayAvatarURL())
        .setColor("RED")
        .setThumbnail(this.client.logo)
        .setDescription(`Are you curious about me? what can i do?
        OK, I'll introduce myself to you.
        
        I'm a discord bot aiming to be versatile with all the features my developers created. And the good thing is that all these features are free of charge. You can use me as much as you want.
        
        But on the other hand there are limitations that you should know, because my developer provides all the features for free, some of the features in me have limits, such as **Anti-NSFW**, **Giveaways**, **Music**, and many others.
        
        And the most interesting thing is, I'm an open source project. So you can use me for personal use or use it as your server mascot.
        
        I'm a bot that uses limited hosting, so sometimes for the next few weeks I'll die and then live again the next week. If you have a little money you can donate it to me so I can live in peace without any limitations. If not that's okay too.
        
        Well this is my introduction to you, I hope you enjoy using me. Have a good day! `)
        return message.channel.send({ content: "📖 | **A little bit about me**", embeds: [embed], components: [row] });
    }
}