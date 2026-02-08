import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import type Command from "../command";

export default class ServerCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server.");
  execute = async (interaction: CommandInteraction) => {
    if (
      !interaction.guild ||
      !interaction.guild.name ||
      !interaction.guild.memberCount
    ) {
      await interaction.reply("This command can only be used in a guild.");
      return;
    }
    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  };
}
