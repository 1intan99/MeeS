import { NSFW_CLASSES } from "nsfwjs/dist/nsfw_classes";

export type LogType = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';

export type frameResult = {
    index: number;
    totalFrames: number;
    predictions: Array<predictionType>;
    image: HTMLCanvasElement | ImageData;
}

export type classifyConfig = {
    topk?: number;
    fps?: number;
    onFrame: (result: frameResult) => any;
}

export type predictionType = {
    className: typeof NSFW_CLASSES[keyof typeof NSFW_CLASSES]
    probability: number
}