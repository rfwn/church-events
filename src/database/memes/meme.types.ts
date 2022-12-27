import { Document, Model } from 'mongoose';
export interface IMeme {
    userId: String;
    url: String;
    messageId: String;
    votes: {
        based: Number;
        cringe: Number;
    };
}
export interface IMemeDocument extends IMeme, Document {}
export type IMemeModel = Model<IMemeDocument>;
