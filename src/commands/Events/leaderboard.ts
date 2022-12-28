import { Meme } from '../../database/memes/meme.model';
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, TextChannel, Channel } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';
export default class LeaderboardCommand extends Command {
    constructor(client: Client) {
        super(
            new SlashCommandBuilder().setName('leaderboard').setDescription('Get the leaderboard for the meme contest'),
            client,
            {},
        );
    }

    override async run(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const channel = await this.client.channels.fetch('1055805341763379240');
        const memes = await Meme.find();
        let basedTop = memes;
        basedTop.sort((a, b) => parseInt(b.votes.based.toString()) - parseInt(a.votes.based.toString()));
        const basedEmbed = new EmbedBuilder().setTitle('Best Memes Leaderboard');
        basedTop = basedTop.slice(0, 10);
        for (let i = 0; i < basedTop.length; i++) {
            const index = i;
            const item = basedTop[i];
            const url = await this.getMessageLink(item.messageId.toString(), channel!);
            basedEmbed.addFields({
                name: `${this.getRank(index)} ${this.client.users.cache.get(item.userId.toString())?.username}`,
                value: `> ${item.votes.based} Votes. [View](${url})`,
            });
        }
        interaction.editReply({ embeds: [basedEmbed] });
    }
    getRank(position: number) {
        switch (position) {
            case 0:
                return '🥇';
                break;
            case 1:
                return '🥈';
                break;
            case 2:
                return '🥉';
                break;
            default:
                return `${position + 1}.`;
                break;
        }
    }
    async getMessageLink(messageId: string, channel: Channel) {
        if (channel instanceof TextChannel) {
            const m = channel.messages.fetch(messageId);
            return (await m)?.url;
        }
    }
}
