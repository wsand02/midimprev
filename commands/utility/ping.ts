import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export class PingCommand {
  data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');
  execute = async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  };
}
