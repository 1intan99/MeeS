import * as tf from "@tensorflow/tfjs-node";
import { NSFWJS, load } from "nsfwjs";
import { Category, LABEL } from "../utils/nsfwjs";
import { fetchContent } from "../utils/fetchContent";
import { expose } from "threads/worker";

let model: NSFWJS;

export const getModel = async () => {
    if (!model) {
        const models = await load('file://tfjs-models/', { size: 299 });

        model = models
    }

    return model;
}

const classifify = {
    classifyImage: async (url: string): Promise<Category[]> => {
        const buffer = await fetchContent(url);
        const model = await getModel();

        const decodeImage = tf.node.decodeImage(buffer,3) as tf.Tensor3D;

        const classification = await model.classify(decodeImage);

        decodeImage.dispose();

        const category = classification.map((x) => {
            return {
                name: x.className,
                accuracy: x.probability
            }
        });

        category.sort((x, z) => {
            return x.accuracy > z.accuracy ? -1 : 1;
        });

        return category;
    },

    classifyGif: async (url: string): Promise<Category[]> => {
        const buffer = await fetchContent(url);
        const model = await getModel();

        const category = await model.classifyGif(buffer, {
            topk: 1
        });

        const frequency: Record<LABEL, number> = {
            Hentai: 0,
            Porn: 0,
            Neutral: 0,
            Drawing: 0,
            Sexy: 0
        }

        category.forEach((x) => {
            frequency[x[0].className]++;
        });

        const res = Object.entries(frequency).map((x): Category => {
            const c = x[0] as LABEL;
            return {
                name: c,
                accuracy: (frequency[c] / category.length)
            }
        }).sort((x, z) => x.accuracy > z.accuracy ? -1 : 1);

        return res;
    }
}

export type Classifier = typeof classifify;

expose(classifify);