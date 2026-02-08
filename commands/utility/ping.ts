import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import type Command from "../command";

export default class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
  execute = async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  };
}
