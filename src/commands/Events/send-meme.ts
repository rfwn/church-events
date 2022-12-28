import { Meme } from '../../database/memes/meme.model';
import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, WebhookClient } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';
export default class MemeCommand extends Command {
    constructor(client: Client) {
        super(
            new SlashCommandBuilder()
                .setName('send-meme')
                .setDescription('Send a meme for the meme contest.')
                .addAttachmentOption((option) =>
                    option.setName('meme').setDescription('Your cringe meme').setRequired(true),
                ),
            client,
            {},
        );
    }

    override async run(interaction: ChatInputCommandInteraction) {
        const memeAttachment = interaction.options.getAttachment('meme');
        await interaction.deferReply();
        const userMemes = await Meme.find({ userId: interaction.user.id });
        if (userMemes.length >= 3) {
            return interaction.editReply({ content: 'You have sent too much memes.' });
        }
        if (!memeAttachment?.contentType?.startsWith('video') && !memeAttachment?.contentType?.startsWith('image')) {
            return interaction.editReply({ content: 'Unsupported file type.' });
        }
        const webhookClient = new WebhookClient({
            id: this.client.config.memesWhId!,
            token: this.client.config.memesWhToken!,
        });

        try {
            const message = await webhookClient.send({
                files: [memeAttachment],
                username: `${interaction.user.username} (${interaction.user.id})`,
                avatarURL: interaction.user.avatarURL({ extension: 'png', size: 512 }) || undefined,
            });
            const doc = new Meme({
                userId: interaction.user.id,
                url: memeAttachment.url,
                messageId: message.id,
                votes: {
                    based: 0,
                    cringe: 0,
                },
            });
            await doc.save();
            const channel = await this.client.channels.fetch(message.channel_id);
            interaction.editReply(`Sent your cringe meme into <#${message.channel_id}>`);
            if (channel instanceof TextChannel) {
                const m = channel.messages.cache.get(message.id);
                await m?.react('786237803511808051');
                await m?.react('860167700947664896');
            }
        } catch (err) {
            interaction.editReply('Someting went wrong');
        }
    }
}
