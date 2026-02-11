import Bot from "./bot";

const bot = new Bot(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_CLIENT_ID,
  process.env.SF2_PATH,
  process.env.SUBPROCESS_TIMEOUT
    ? parseFloat(process.env.SUBPROCESS_TIMEOUT)
    : undefined,
);

bot.login();
