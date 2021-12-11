import { init, captureException, close } from "@sentry/node";

export default class SentryLogger {
    static instance: SentryLogger;

    constructor(dsn: string) {
        init({dsn, sampleRate: 0.75, environment: process.env.NODE_ENV === "development" ? "development" : "production", autoSessionTracking: false});
    }

    static getInstance(): SentryLogger {
        if (!SentryLogger.instance) {
            const dsn = process.env.DSN;

            if (!dsn) {
                throw new Error("Faidl to initalize SentryLogger: DSN is not found!");
            }
            SentryLogger.instance = new SentryLogger(dsn as string);
        }
        return SentryLogger.instance;
    }

    private captureError(err: Error): void {
        if (process.env.NODE_ENV === "development") {
            console.log(err);
        }

        captureException(err);
    }

    public logger(err: Error): void {
        err.message = `[ BOT ]: ${err.message}`;

        this.captureError(err);
    }

    public async closeLogger(): Promise<void> {
        await close();
    }
}