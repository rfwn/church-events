import { Schema } from 'mongoose';
const MemerSchema = new Schema({
    userId: String,
    url: String,
    messageId: String,
    votes: {
        cringe: Number,
        based: Number,
    },
});
export default MemerSchema;
