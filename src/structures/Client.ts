import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';
import Logger from '../utils/Logger';
import config from '../config';
import { WebhookService } from '../services/WebhookService';
import EventRegistry from '../registry/EventRegistry';
import Event from './Event';
import Command from './Command';
import CommandRegistry from '../registry/CommandRegistry';
import ContextMenuRegistry from '../registry/ContextMenuRegistry';
import init from '../database/init';

class Valence extends Client {
    public readonly config: {
        token: string | undefined;
        clientId: string | undefined;
        ownerId: string | undefined;
        serverId: string | undefined;
        memesWhId: string | undefined;
        memesWhToken: string | undefined;
        mongoUrl: string | undefined;
        debug: boolean;
    };
    public readonly eventRegistry: EventRegistry;
    public readonly commandRegistry: CommandRegistry;
    public readonly contextRegistry: ContextMenuRegistry;
    public events: Map<string, Event>;
    public commands: Map<string, Command>;
    public contexts: Map<string, Command>;
    public readonly database: typeof init;
    public readonly logger: typeof Logger;
    public readonly webhookManager: WebhookService;
    constructor() {
        super({
            partials: [
                Partials.Message,
                Partials.User,
                Partials.Channel,
                Partials.Reaction,
                Partials.GuildScheduledEvent,
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.MessageContent,
            ],
            presence: {
                status: 'online',
                activities: [
                    {
                        // eslint-disable-next-line prettier/prettier
                        name: 'cringe memes',
                        type: ActivityType.Watching,
                    },
                ],
            },
            allowedMentions: { parse: ['users'] },
            ws: {
                // You can remove this if you want the default presence
                properties: {
                    browser: 'Discord Android',
                },
            },
        });
        this.config = config;
        this.logger = Logger;
        this.database = init;
        this.webhookManager = new WebhookService(this);
        this.events = new Map();
        this.eventRegistry = new EventRegistry(this);
        this.commands = new Map();
        this.commandRegistry = new CommandRegistry(this);
        this.contexts = new Map();
        this.contextRegistry = new ContextMenuRegistry(this);
        this.eventRegistry.loadEvents().then(() => {
            this.commandRegistry.loadCommands().then(() => {
                this.contextRegistry.loadContexts();
            });
        });
    }
}

export default Valence;
