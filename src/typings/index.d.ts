import 'discord.jsz';

declare module 'discord.js' {
    interface ClientEvents {
        ready: [];
        raw: [packet: any];
    }

    interface Client {
        emit(event: 'ready'): boolean;
    }
}
