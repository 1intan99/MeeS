<h1 align="center">MeeS Discord Bot</h1>
<br />
<p align="center">
    <a href="https://github.com/ameliakiara/MeeS">
        <img src="https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png" alt="Amelia-Corp" width="200" height="200">
    </a>
    <p align="center">
        MeeS is a powerful bot build with Discord.JS and Discord-TS
        <br />
        <br />
        <a href="https://discord.com/api/oauth2/authorize?client_id=904209927415930950&permissions=8&scope=applications.commands%20bot">Invite me!</a>
        -
        <a href="https://github.com/ameliakiara/MeeS/issue">Report Bug</a>
        -
        <a href="https://github.com/ameliakiara/MeeS/issue">Requst Feature</a>
    </p>
</p>

## ✨ About
This is an advanced discord bot template with TypeScript

You can easily create more advance, complex system with this template

## 📜 Feature
-   Easy to develop advanced and complex systems
    -   Because you have access to everything. You can change everything whatever you want.
-   Command handler with error handling (`src/classes/CommandHandler.ts`)
    -   Your bot doesn't crash on errors anymore. Errors will be logged to console.
-   Cooldown, permission and nsfw channel checking on commands
    -   You can set up cooldowns, required permissions and requiring nsfw channel for each command uniquely.
-   Auto command, lavalink & event registration and checking (`src/classes/Registry.ts`)
    -   You don't have to spend time with defining commands and events manually.
-   Beautiful, detailed console logs (`src/classes/Logger.ts`)
    -   More beautiful, more readable. Thats good right?
-   Full customizable discord client (`src/structures/MeeS.ts`)
    -   You can easily add properties to client.

## 🤖 Prepared Commands

-   Dynamic help command

    -   You can get command list with groups (`help`)
    -   You can get detailed information about a command (`help [command-name]`)
    -   This command renders all your commands dynamically. You don't have to waste time about documenting commands.
    -   This command shows command list to users by their permissions. Forexample developer commands won't shown in normal user's help command and they can't see detailed information about it.
    -   Disabled commands won't shown in help command and users (developers included) can't see detailed information about it.

-   Reboot command **(Developer command by default)**
    -   You don't have to reboot your bot on console. You can reboot by using this command. (`reboot`)
    -   These events happen when reboot command run:
        -   Bot stops
        -   Resetting events, commands, command groups and cooldowns
        -   Reregistering events and commands
        -   Starting the bot again

## ❓ What Is The Developer Permission

-   You can create commands just usable for developers
-   Developers doesn't affected from:
    -   Cooldowns
    -   Permission Checking
    -   NSFW Channel Checking

---

## 📥 Installation

You can use `npm` instead of `yarn` but i recommended to use `yarn`.

```
yarn install
```

## ⚙️ Setting Up

-   Rename `.env.example` to `.env` and fill it.
-   Open `src/index.ts` and set up **moment-timezone** for your locale.

## 🤖 Running The Bot

-   Without Building
    -   Type `yarn dev` to run.
-   With Building
    -   Type `yarn build` to build the project.
    -   Type `yarn start` to run the builded project.

---

## 📌 Important

You can change client intents from `src/client.ts`.

---

## 🛠️ Creating Commands & Events

### Commands

-   Create a new file to `src/commands`. (You can create files in directories)
-   Open your file.
-   Add command template.

```ts
import { Message } from 'discord.js';

import Command from '../../structures/Command';
import MeeS from '../../structures/Client';

export default class ExampleCommand extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: 'example',
            group: 'Developer',
            description: 'An example command.',
            require: {
                developer: true
            }
        });
    }

    async run(message: Message, args: string[]) {
        await message.reply('Wow, example command working!');
    }
}
```

### Events

-   Create a new file to `src/events`. (You can create files in directories)
-   Open your file.
-   Add event template.

```ts
import { GuildMember } from 'discord.js';

import MeeS from '../../structures/Client';
import Event from '../../structures/Event';

export default class GuildMemberAddEvent extends Event {
    constructor(client: MeeS) {
        super(client, 'guildMemberAdd');
    }

    async run(member: GuildMember) {
        console.log(`${member.user.tag} joined to ${member.guild.name}.`);
    }
}
```

You can check event parameters from [discord.js.org](https://discord.js.org/#/docs/main/stable/class/Client).

---

## ⏰ Cancelling Cooldown

If you want to cancel adding command cooldown to user:

-   Open your command file
-   Add this parameter to `run` function:

    ```ts
    cancelCooldown: () => void
    ```

    It should looks like that:

    ```ts
    async run(message: Message, args: string[], cancelCooldown: () => void)
    ```

-   Call `cancelCooldown` function where you want to cancelling cooldown.

---

## 👑 Credit

-   This is modification discord bot template
    - [ts-discord-bot](https://github.com/BUR4KBEY/ts-discord-bot) Pure Code
-   Part of music from
    - [lavamusic](https://github.com/brblacky/lavamusic) Pure Code
-   Build using 
    - [Discord.JS](https://discord.js.org) and  [Discord-Ts](http://discord-ts.js.org)

[![Version][version-shield]](version-url)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GPL-3.0 License][license-shield]][license-url]

Distributed under the GPL-3.0 License. See [`LICENSE`](https://github.com/ameliakiara/MeeS/blob/master/LICENSE) for more information.

[version-shield]: https://img.shields.io/github/package-json/v/ameliakiara/MeeS?style=for-the-badge
[version-url]: https://github.com/ameliakiara/MeeS
[contributors-shield]: https://img.shields.io/github/contributors/ameliakiara/MeeS.svg?style=for-the-badge
[contributors-url]: https://github.com/ameliakiara/MeeS/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ameliakiara/MeeS.svg?style=for-the-badge
[forks-url]: https://github.com/ameliakiara/MeeSc/network/members
[stars-shield]: https://img.shields.io/github/stars/ameliakiara/MeeS.svg?style=for-the-badge
[stars-url]: https://github.com/ameliakiara/MeeSc/stargazers
[issues-shield]: https://img.shields.io/github/issues/ameliakiara/MeeS.svg?style=for-the-badge
[issues-url]: https://github.com/ameliakiara/MeeS/issues
[license-shield]: https://img.shields.io/github/license/ameliakiara/MeeS.svg?style=for-the-badge
[license-url]: https://github.com/ameliakiara/MeeS/blob/master/LICENSE
