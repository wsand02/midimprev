import Bot from "./bot";
import { parseArgs } from "util";

(async () => {
  const { values } = parseArgs({
    args: Bun.argv,
    options: {
      purgeGlobal: { type: "string" },
      purgeGuild: { type: "boolean" },
      deployGuild: { type: "boolean" },
      deployGlobal: { type: "boolean" },
      skipLogin: { type: "boolean" },
    },
    allowPositionals: true,
    strict: true,
  });

  const bot = new Bot(
    process.env.DISCORD_TOKEN,
    process.env.DISCORD_GUILD_ID ? process.env.DISCORD_GUILD_ID : undefined,
    process.env.DISCORD_CLIENT_ID,
    process.env.SF2_PATH,
    process.env.SUBPROCESS_TIMEOUT
      ? parseFloat(process.env.SUBPROCESS_TIMEOUT)
      : undefined,
  );

  if (values.purgeGlobal) {
    console.log(
      `Trying to remove global command with ID: ${values.purgeGlobal}`,
    );
    await bot.purgeCommand(values.purgeGlobal);
  }

  if (values.purgeGuild) {
    console.log(`Trying to remove commands from the server`);
    await bot.purgeGuildCommands();
  }

  if (values.deployGuild) {
    console.log(`Trying to deploy commands to the server`);
    await bot.deployGuildCommands();
  }

  if (values.deployGlobal) {
    console.log(`Trying to deploy commands globally`);
    await bot.deployGlobalCommands();
  }

  if (!values.skipLogin) {
    bot.login();
  }
})();
