import { Meme } from './../../database/memes/meme.model';
import { MessageReaction, User } from 'discord.js';
import Event from '../../structures/Event';

export default class MessageReactionRemove extends Event {
    override async run(reaction: MessageReaction, user: User) {
        if (user.bot) return;
        if (reaction.message.channel.id !== '1056177514587889797') return;
        if (reaction.emoji.name !== '😂' && reaction.emoji.name !== '🤮') return;
        const meme = await Meme.findOne({ messageId: reaction.message.id });
        if (!meme) return;
        if (reaction.emoji.name == '😂') {
            meme.votes.based = reaction.count <= 1 ? 0 : reaction.count - 1;
        } else {
            meme.votes.cringe = reaction.count <= 1 ? 0 : reaction.count - 1;
        }
        await meme.save();
    }
}
