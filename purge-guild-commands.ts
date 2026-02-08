import Midimprev from "./midimprev";

const args = process.argv.slice(2);

const bot = new Midimprev(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_CLIENT_ID,
);

bot.purgeGuildCommands();
