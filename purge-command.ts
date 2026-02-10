import Bot from "./src/bot";

const args = process.argv.slice(2);

const bot = new Bot(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_CLIENT_ID,
);

if (args[0]) {
  bot.purgeCommand(args[0]);
}
