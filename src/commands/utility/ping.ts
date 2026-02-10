import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import type Command from "../command";
import type Bot from "../../bot";

export default class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
  execute = async (_bot: Bot, interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  };
}
