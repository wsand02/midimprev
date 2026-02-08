import Midimprev from "./midimprev";

const bot = new Midimprev(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_CLIENT_ID,
  process.env.SF2_PATH,
);

bot.login();
