import { model } from 'mongoose';
import { IMemeDocument } from './meme.types';
import MemeSchema from './meme.schema';
export const Meme = model<IMemeDocument>('memes', MemeSchema);
