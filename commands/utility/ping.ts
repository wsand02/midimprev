import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import type Command from "../command";
import type Midimprev from "../../midimprev";

export default class PingCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");
  execute = async (_bot: Midimprev, interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  };
}
