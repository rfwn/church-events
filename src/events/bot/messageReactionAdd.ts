import { Meme } from './../../database/memes/meme.model';
import { MessageReaction, User } from 'discord.js';
import Event from '../../structures/Event';

export default class MessageReactionAdd extends Event {
    override async run(reaction: MessageReaction, user: User) {
        if (user.bot) return;
        if (reaction.message.channel.id !== '1055805341763379240') return;
        if (reaction.emoji.name !== 'Laugh' && reaction.emoji.name !== 'What') return;
        const meme = await Meme.findOne({ messageId: reaction.message.id });
        if (!meme) return;
        if (reaction.emoji.name == 'Laugh') {
            const other = reaction.message.reactions.cache.find((react) => react.emoji.name == 'What');
            other?.users.remove(user);
            meme.votes.based = reaction.count <= 1 ? 0 : reaction.count - 1;
        } else {
            const other = reaction.message.reactions.cache.find((react) => react.emoji.name == 'Laugh');
            other?.users.remove(user);
            meme.votes.cringe = reaction.count <= 1 ? 0 : reaction.count - 1;
        }
        await meme.save();
    }
}
