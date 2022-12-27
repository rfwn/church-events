import Client from './structures/Client';
const bot = new Client();

(async () => {
    await bot.database.init(bot);
    await bot.login(bot.config.token);
})();
