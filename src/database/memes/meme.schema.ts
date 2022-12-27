import { Schema } from 'mongoose';
const MemerSchema = new Schema({
    userId: String,
    url: String,
    messageId: String,
    votes: [
        {
            voteType: String,
            voterId: String,
        },
    ],
});
export default MemerSchema;
